// Funções puras de cálculo de endereços IPv4.
// Internamente os endereços são tratados como números de 32 bits sem sinal.

export const PREFIXO_MINIMO = 8;
export const PREFIXO_MAXIMO = 32;

const OCTETO = "(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])";
const REGEX_IP = new RegExp(`^${OCTETO}\\.${OCTETO}\\.${OCTETO}\\.${OCTETO}$`);
const REGEX_CIDR = /^([^/\s]+)\/(\d{1,2})$/;

export function ipValido(ip) {
  return typeof ip === "string" && REGEX_IP.test(ip);
}

export function ipParaNumero(ip) {
  return ip
    .split(".")
    .reduce((numero, octeto) => ((numero << 8) | Number(octeto)) >>> 0, 0);
}

export function numeroParaIp(numero) {
  return [24, 16, 8, 0].map((desloc) => (numero >>> desloc) & 255).join(".");
}

export function mascaraDoPrefixo(prefixo) {
  if (prefixo === 0) return "0.0.0.0";
  return numeroParaIp((0xffffffff << (32 - prefixo)) >>> 0);
}

// Retorna o prefixo (8 a 32) da máscara, ou null se ela não for válida.
export function prefixoDaMascara(mascara) {
  if (!ipValido(mascara)) return null;

  const numero = ipParaNumero(mascara);
  const bitsDeHost = ~numero >>> 0;
  // Máscara contínua: os bits de host são todos 1 no final (ex.: 0...0111)
  if ((bitsDeHost & (bitsDeHost + 1)) !== 0) return null;

  let prefixo = 0;
  for (let resto = numero; resto !== 0; resto = (resto << 1) >>> 0) {
    prefixo++;
  }
  return prefixo >= PREFIXO_MINIMO ? prefixo : null;
}

export function mascaraValida(mascara) {
  return prefixoDaMascara(mascara) !== null;
}

// Lê "endereço/prefixo". Retorna { ip, prefixo } ou null se for inválido.
export function lerCIDR(texto) {
  const partes = REGEX_CIDR.exec(texto || "");
  if (!partes || !ipValido(partes[1])) return null;

  const prefixo = Number(partes[2]);
  if (prefixo < PREFIXO_MINIMO || prefixo > PREFIXO_MAXIMO) return null;
  return { ip: partes[1], prefixo };
}

export function calcularRede(ip, mascara) {
  return numeroParaIp((ipParaNumero(ip) & ipParaNumero(mascara)) >>> 0);
}

export function calcularBroadcast(ip, mascara) {
  return numeroParaIp((ipParaNumero(ip) | ~ipParaNumero(mascara)) >>> 0);
}

// Descobre a máscara a partir do par rede/broadcast, ou null se o par não
// formar uma sub-rede válida.
export function mascaraPorRedeEBroadcast(rede, broadcast) {
  const numeroRede = ipParaNumero(rede);
  const bitsDeHost = (numeroRede ^ ipParaNumero(broadcast)) >>> 0;

  const bitsContinuos = (bitsDeHost & (bitsDeHost + 1)) === 0;
  const redeSemBitsDeHost = (numeroRede & bitsDeHost) === 0;
  if (!bitsContinuos || !redeSemBitsDeHost) return null;

  const mascara = numeroParaIp(~bitsDeHost >>> 0);
  return mascaraValida(mascara) ? mascara : null;
}

export function paraBinario(ip) {
  return ip
    .split(".")
    .map((octeto) => Number(octeto).toString(2).padStart(8, "0"))
    .join(".");
}

export function classeDoEndereco(ip) {
  const primeiroOcteto = Number(ip.split(".")[0]);

  if (primeiroOcteto < 128) return "Pertence a classe A. Bit(s) Inicial(ais) --> 0";
  if (primeiroOcteto < 192) return "Pertence a classe B. Bit(s) Inicial(ais) --> 10";
  if (primeiroOcteto < 224) return "Pertence a classe C. Bit(s) Inicial(ais) --> 110";
  if (primeiroOcteto < 240) {
    return "Pertence a classe D (multicast). Bit(s) Inicial(ais) --> 1110";
  }
  return "Pertence a classe E (reservada). Bit(s) Inicial(ais) --> 1111";
}

const CAMPOS = ["rede", "host", "mascara", "cidr", "broadcast"];

// Recebe os campos da calculadora ({ rede, host, mascara, cidr, broadcast }),
// completa os que faltam e confere se os preenchidos são coerentes entre si.
// Retorna { resultado } em caso de sucesso ou { erro } com uma mensagem.
export function calcular(campos) {
  const c = {};
  CAMPOS.forEach((campo) => (c[campo] = (campos[campo] || "").trim()));

  if (c.rede && !ipValido(c.rede)) return { erro: "Endereço de rede inválido." };
  if (c.host && !ipValido(c.host)) return { erro: "Endereço de host inválido." };
  if (c.broadcast && !ipValido(c.broadcast)) {
    return { erro: "Endereço de broadcast inválido." };
  }
  if (c.mascara && !mascaraValida(c.mascara)) {
    return {
      erro: "Máscara inválida. Use uma máscara contínua de 255.0.0.0 (/8) até 255.255.255.255 (/32).",
    };
  }

  const cidr = c.cidr ? lerCIDR(c.cidr) : null;
  if (c.cidr && !cidr) {
    return { erro: "CIDR inválido. Use o formato 192.168.1.0/24, com prefixo de /8 a /32." };
  }

  const preenchidos = CAMPOS.filter((campo) => c[campo]).length;
  if (preenchidos < 2 && !cidr) {
    return { erro: "Preencha pelo menos dois campos (ou apenas o CIDR)." };
  }

  // 1. Descobre a máscara
  if (c.mascara && cidr && mascaraDoPrefixo(cidr.prefixo) !== c.mascara) {
    return { erro: "A máscara não corresponde ao prefixo do CIDR." };
  }
  let mascara = c.mascara || (cidr && mascaraDoPrefixo(cidr.prefixo));
  if (!mascara && c.rede && c.broadcast) {
    mascara = mascaraPorRedeEBroadcast(c.rede, c.broadcast);
    if (!mascara) {
      return { erro: `${c.rede} e ${c.broadcast} não formam uma sub-rede válida.` };
    }
  }
  if (!mascara) {
    return {
      erro: "Não é possível descobrir a máscara: informe a máscara, o CIDR ou a rede junto com o broadcast.",
    };
  }
  const prefixo = prefixoDaMascara(mascara);

  // 2. Descobre a rede e o broadcast a partir de qualquer endereço informado
  const base = c.rede || (cidr && cidr.ip) || c.host || c.broadcast;
  if (!base) {
    return { erro: "Informe também um endereço (rede, host, CIDR ou broadcast)." };
  }
  const rede = calcularRede(base, mascara);
  const broadcast = calcularBroadcast(rede, mascara);

  // 3. Confere se os campos preenchidos são coerentes com a rede encontrada
  if (c.rede && c.rede !== rede) {
    return {
      erro: `${c.rede} não é um endereço de rede para a máscara ${mascara} (a rede seria ${rede}).`,
    };
  }
  if (cidr && calcularRede(cidr.ip, mascara) !== rede) {
    return { erro: `O CIDR ${c.cidr} não pertence à rede ${rede}/${prefixo}.` };
  }
  if (c.host) {
    if (calcularRede(c.host, mascara) !== rede) {
      return { erro: `O host ${c.host} não pertence à rede ${rede}/${prefixo}.` };
    }
    if (prefixo <= 30 && c.host === rede) {
      return { erro: `${c.host} é o endereço da rede e não pode ser usado como host.` };
    }
    if (prefixo <= 30 && c.host === broadcast) {
      return { erro: `${c.host} é o endereço de broadcast e não pode ser usado como host.` };
    }
  }
  if (c.broadcast && c.broadcast !== broadcast) {
    return {
      erro: `O broadcast da rede ${rede}/${prefixo} é ${broadcast}, não ${c.broadcast}.`,
    };
  }

  // Um CIDR como 192.168.1.10/24 também informa o host
  const hostDoCIDR = cidr && cidr.ip !== rede && cidr.ip !== broadcast ? cidr.ip : "";

  return {
    resultado: {
      rede,
      host: c.host || hostDoCIDR,
      mascara,
      cidr: c.cidr || `${rede}/${prefixo}`,
      broadcast,
      classe: classeDoEndereco(rede),
    },
  };
}
