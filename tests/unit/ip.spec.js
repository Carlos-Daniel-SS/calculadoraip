import {
  calcular,
  calcularBroadcast,
  calcularRede,
  classeDoEndereco,
  ipValido,
  lerCIDR,
  mascaraDoPrefixo,
  mascaraPorRedeEBroadcast,
  mascaraValida,
  paraBinario,
  prefixoDaMascara,
} from "@/utils/ip";

const campos = (preenchidos) => ({
  rede: "",
  host: "",
  mascara: "",
  cidr: "",
  broadcast: "",
  ...preenchidos,
});

describe("ipValido", () => {
  it.each(["0.0.0.0", "192.168.1.1", "255.255.255.255", "10.0.0.1"])(
    "aceita %s",
    (ip) => expect(ipValido(ip)).toBe(true)
  );

  it.each(["256.0.0.1", "192.168.1", "192.168.01.1", "1.2.3.4.5", "abc", "", " 1.2.3.4"])(
    "recusa %p",
    (ip) => expect(ipValido(ip)).toBe(false)
  );
});

describe("máscara e prefixo", () => {
  it.each([
    ["255.0.0.0", 8],
    ["255.255.252.0", 22],
    ["255.255.255.0", 24],
    ["255.255.255.128", 25],
    ["255.255.255.255", 32],
  ])("%s tem prefixo /%i", (mascara, prefixo) => {
    expect(prefixoDaMascara(mascara)).toBe(prefixo);
    expect(mascaraDoPrefixo(prefixo)).toBe(mascara);
  });

  it.each(["255.0.255.0", "255.255.255.1", "240.0.0.0", "0.0.0.0", "1.2.3"])(
    "recusa a máscara %s",
    (mascara) => expect(mascaraValida(mascara)).toBe(false)
  );
});

describe("lerCIDR", () => {
  it("lê endereço e prefixo", () => {
    expect(lerCIDR("192.168.1.0/24")).toEqual({ ip: "192.168.1.0", prefixo: 24 });
  });

  it.each(["10.0.0.0/4", "10.0.0.0/33", "10.0.0.0", "300.0.0.0/24", "10.0.0.0/"])(
    "recusa %s",
    (cidr) => expect(lerCIDR(cidr)).toBeNull()
  );
});

describe("rede, broadcast e binário", () => {
  it("calcula rede e broadcast de um host", () => {
    expect(calcularRede("192.168.1.130", "255.255.255.128")).toBe("192.168.1.128");
    expect(calcularBroadcast("192.168.1.130", "255.255.255.128")).toBe("192.168.1.255");
    expect(calcularBroadcast("10.0.1.7", "255.255.252.0")).toBe("10.0.3.255");
  });

  it("converte para binário", () => {
    expect(paraBinario("192.168.1.0")).toBe("11000000.10101000.00000001.00000000");
  });

  it.each([
    ["10.0.0.0", "10.0.0.255", "255.255.255.0"],
    ["192.168.0.0", "192.168.0.255", "255.255.255.0"],
    ["192.168.1.128", "192.168.1.255", "255.255.255.128"],
    ["10.0.0.0", "10.0.3.255", "255.255.252.0"],
    ["172.16.0.0", "172.31.255.255", "255.240.0.0"],
  ])("rede %s + broadcast %s => máscara %s", (rede, broadcast, mascara) => {
    expect(mascaraPorRedeEBroadcast(rede, broadcast)).toBe(mascara);
  });

  it.each([
    ["10.0.0.0", "10.0.2.255"],
    ["192.168.1.10", "192.168.1.255"],
  ])("rede %s + broadcast %s não é sub-rede", (rede, broadcast) => {
    expect(mascaraPorRedeEBroadcast(rede, broadcast)).toBeNull();
  });
});

describe("classeDoEndereco", () => {
  it.each([
    ["10.0.0.0", "classe A"],
    ["172.16.0.0", "classe B"],
    ["192.168.1.0", "classe C"],
    ["224.0.0.1", "classe D"],
    ["240.0.0.1", "classe E"],
  ])("%s pertence à %s", (ip, classe) => {
    expect(classeDoEndereco(ip)).toContain(classe);
  });
});

describe("calcular", () => {
  const rede24 = {
    rede: "192.168.1.0",
    mascara: "255.255.255.0",
    cidr: "192.168.1.0/24",
    broadcast: "192.168.1.255",
  };

  it.each([
    ["rede + máscara", { rede: "192.168.1.0", mascara: "255.255.255.0" }],
    ["rede + CIDR", { rede: "192.168.1.0", cidr: "192.168.1.0/24" }],
    ["rede + broadcast", { rede: "192.168.1.0", broadcast: "192.168.1.255" }],
    ["máscara + CIDR", { mascara: "255.255.255.0", cidr: "192.168.1.0/24" }],
    ["máscara + broadcast", { mascara: "255.255.255.0", broadcast: "192.168.1.255" }],
    ["só CIDR", { cidr: "192.168.1.0/24" }],
  ])("completa os campos a partir de %s", (_, preenchidos) => {
    const { resultado, erro } = calcular(campos(preenchidos));
    expect(erro).toBeUndefined();
    expect(resultado).toMatchObject(rede24);
    expect(resultado.classe).toContain("classe C");
  });

  it("completa a partir de host + máscara", () => {
    const { resultado } = calcular(campos({ host: "192.168.1.10", mascara: "255.255.255.0" }));
    expect(resultado).toMatchObject({ ...rede24, host: "192.168.1.10" });
  });

  it("completa a partir de host + CIDR", () => {
    const { resultado } = calcular(campos({ host: "192.168.1.10", cidr: "192.168.1.0/24" }));
    expect(resultado).toMatchObject({ ...rede24, host: "192.168.1.10" });
  });

  it("aceita CIDR com endereço de host, sozinho ou com a máscara", () => {
    for (const preenchidos of [
      { cidr: "192.168.1.10/24" },
      { cidr: "192.168.1.10/24", mascara: "255.255.255.0" },
    ]) {
      const { resultado, erro } = calcular(campos(preenchidos));
      expect(erro).toBeUndefined();
      expect(resultado).toMatchObject({
        rede: "192.168.1.0",
        host: "192.168.1.10",
        broadcast: "192.168.1.255",
      });
    }
  });

  it.each([
    ["10.0.0.0", "10.0.0.255", "255.255.255.0"],
    ["192.168.1.128", "192.168.1.255", "255.255.255.128"],
    ["10.0.0.0", "10.0.3.255", "255.255.252.0"],
  ])("rede %s + broadcast %s descobre a máscara %s", (rede, broadcast, mascara) => {
    const { resultado, erro } = calcular(campos({ rede, broadcast }));
    expect(erro).toBeUndefined();
    expect(resultado.mascara).toBe(mascara);
  });

  it("recusa broadcast que não combina com a máscara", () => {
    const { erro } = calcular(campos({ mascara: "255.255.255.0", broadcast: "192.168.1.10" }));
    expect(erro).toContain("192.168.1.255");
  });

  it("recusa host de outra rede", () => {
    const { erro } = calcular(
      campos({ rede: "192.168.1.0", mascara: "255.255.255.0", host: "10.0.0.1" })
    );
    expect(erro).toContain("não pertence");
  });

  it.each(["192.168.1.0", "192.168.1.255"])("recusa %s como host", (host) => {
    const { erro } = calcular(campos({ host, mascara: "255.255.255.0" }));
    expect(erro).toContain("não pode ser usado como host");
  });

  it("aceita o único endereço de uma rede /32 como host", () => {
    const { erro } = calcular(campos({ host: "10.0.0.5", mascara: "255.255.255.255" }));
    expect(erro).toBeUndefined();
  });

  it("recusa endereço de rede que não é de rede para a máscara", () => {
    const { erro } = calcular(campos({ rede: "192.168.1.10", mascara: "255.255.255.0" }));
    expect(erro).toContain("192.168.1.0");
  });

  it("recusa máscara diferente do prefixo do CIDR", () => {
    const { erro } = calcular(campos({ mascara: "255.255.0.0", cidr: "192.168.1.0/24" }));
    expect(erro).toContain("prefixo do CIDR");
  });

  it.each([
    ["só um campo", { rede: "192.168.1.0" }],
    ["rede + host (sem máscara)", { rede: "192.168.1.0", host: "192.168.1.1" }],
    ["máscara inválida", { rede: "192.168.1.0", mascara: "255.0.255.0" }],
    ["CIDR com prefixo /4", { cidr: "10.0.0.0/4" }],
    ["nenhum campo", {}],
  ])("retorna erro para %s", (_, preenchidos) => {
    const { resultado, erro } = calcular(campos(preenchidos));
    expect(resultado).toBeUndefined();
    expect(erro).toEqual(expect.any(String));
  });

  it("ignora espaços em volta dos valores", () => {
    const { resultado } = calcular(campos({ rede: " 192.168.1.0 ", mascara: "255.255.255.0 " }));
    expect(resultado).toMatchObject(rede24);
  });
});
