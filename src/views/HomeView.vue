<template>
  <v-container class="spacing-playground pa-6">
    <v-row>
      <v-col> </v-col>
      <v-col>
        <h1 class="text-center">Calculadora IPv4</h1>
      </v-col>
      <v-col></v-col>
    </v-row>
    <br />

    <v-row no-gutters>
      <v-col>
        <form>
          <v-text-field
            v-model="endereco_ip_rede"
            class="pe-2"
            placeholder="Ex.: 133.8.0.0"
            label="Digite o endereço de rede:"
          >
          </v-text-field>
        </form>
      </v-col>
      <v-col>
        <form>
          <v-text-field
            v-model="endereco_ip"
            class="pe-2"
            placeholder="Ex.: 133.8.0.1"
            label="Digite o endereço de host:"
          >
          </v-text-field>
        </form>
      </v-col>
      <v-col>
        <form>
          <v-text-field
            v-model="mascara"
            class="pe-2"
            placeholder="Ex.: 255.255.255.0"
            label="Máscara:"
          >
          </v-text-field>
        </form>
      </v-col>
    </v-row>

    <v-row no-gutters>
      <v-col>
        <form>
          <v-text-field
            v-model="modelo_CIDR"
            class="pe-2"
            placeholder="Ex.: 133.8.0.0/24"
            label="Representação CIDR:"
          >
          </v-text-field>
        </form>
      </v-col>
      <v-col>
        <form>
          <v-text-field
            v-model="endereco_broadcast"
            class="pe-2"
            placeholder="Ex.: 133.8.0.255"
            label="Digite o endereço de broadcast:"
          >
          </v-text-field>
        </form>
      </v-col>
    </v-row>

    <v-row>
      <v-col> </v-col>
      <v-col align="center" jutify="center">
        <v-btn
          class="bg-green"
          width="100%"
          @click="
            verificar_classe();
            encontrarEnderecoDeBroadcast();
            endereco_rede();
            retorna_modeloCIDR();
            retornaIP_em_binario();
            retorna_mascaraBin();
            retornaEnderecoIPDoCIDR();
            retornaMascaraDoCIDR()
          "
          >Calcular</v-btn
        >
      </v-col>
      <v-col></v-col>
    </v-row>
    <v-row>
      <v-col>
        <h2 class="text-center">Calculadora IPv4</h2>
        <p class="d-flex justify-center">
          Para utilizar a calculadora, preencha dois ou mais campos e escolha a
          opção CALCULAR para o preenchimento dos campos vazios.
        </p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "HomeView",

  data() {
    return {
      endereco_ip: "",
      mascara: "",
      endereco_ip_rede: "",
      endereco_broadcast: "",
      modelo_CIDR: "",
    };
  },
  methods: {
    retorna_binario(decimal) {
      if (
        this.enderecoIpEhValido(this.endereco_ip) &&
        this.enderecoIpEhValido(this.mascara)
      ) {
        let partes_ip = decimal.split(".");
        let binario = [];

        for (let i = 0; i < partes_ip.length; i++) {
          let endereço_decimal = parseInt(partes_ip[i]);
          let endereço_binario = endereço_decimal.toString(2).padStart(8, "0");

          binario.push(endereço_binario);
        }
        let enderecoBIn = binario.join(".");

        return enderecoBIn;
      }
    },
    enderecoIpEhValido(enderecoIP) {
      let regex =
        /^([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/;
      return regex.test(enderecoIP);
    },
    verificar_classe() {
      if (
        this.enderecoIpEhValido(this.endereco_ip) &&
        this.enderecoIpEhValido(this.mascara)
      ) {
        let endereço_em_binário = this.retorna_binario(this.endereco_ip);
        let dividir_octetos = endereço_em_binário.split(".");

        let primeiro_bit = dividir_octetos[0].slice(0, 1);
        let segundo_bit = dividir_octetos[0].slice(0, 2);
        let terceiro_bit = dividir_octetos[0].slice(0, 3);

        let classe;
        if (primeiro_bit === "0") {
          classe = `A`;
        } else if (segundo_bit === "10") {
          classe = `B`;
        } else if (terceiro_bit === "110") {
          classe = `C`;
        } else {
          classe = `Classe não identificada`;
        }
        console.log(
          `O endereço ${this.endereco_ip} pertence a classe ${classe}`
        );
      }
      return null;
    },
    retornaIP_em_binario() {
      let endereco_ipbinario = this.retorna_binario(this.endereco_ip);
      console.log(`Endereço IP em enderbinário: ${endereco_ipbinario}`);
      return endereco_ipbinario;
    },
    retorna_mascaraBin() {
      //let mascara_em_binario = ;

      console.log(this.retorna_binario(this.mascara));
      //return mascara_em_binario;
    },
    encontrarEnderecoDeBroadcast() {
      // Divide o endereço IP e a máscara de sub-rede em octetos
      if (
        this.enderecoIpEhValido(this.endereco_ip) &&
        this.enderecoIpEhValido(this.mascara)
      ) {
        let enderecoOctetos = this.endereco_ip.split(".");
        let mascaraOctetos = this.mascara.split(".");

        // Converte os octetos de string para números inteiros
        for (let i = 0; i < 4; i++) {
          enderecoOctetos[i] = parseInt(enderecoOctetos[i]);
          mascaraOctetos[i] = parseInt(mascaraOctetos[i]);
        }

        // Calcula o endereço de broadcast
        let broadcastOctetos = [];
        for (let i = 0; i < 4; i++) {
          broadcastOctetos.push(enderecoOctetos[i] | (255 - mascaraOctetos[i]));
        }
        let broadcast = broadcastOctetos.join(".");

        // Retorna o endereço de broadcast calculado
        console.log(`O broadcast da rede é ${broadcast}`);
        this.endereco_broadcast = broadcast;
        return broadcast;
      }
      return null;
    },
    endereco_rede() {
      if (
        this.enderecoIpEhValido(this.endereco_ip) &&
        this.enderecoIpEhValido(this.mascara)
      ) {
        let enderecoOctetos = this.endereco_ip.split(".");
        let mascaraOctetos = this.mascara.split(".");

        for (let i = 0; i < 4; i++) {
          enderecoOctetos[i] = parseInt(enderecoOctetos[i]);
          mascaraOctetos[i] = parseInt(mascaraOctetos[i]);
        }

        let redeOctetos = [];

        for (let i = 0; i < 4; i++) {
          redeOctetos.push(enderecoOctetos[i] & mascaraOctetos[i]);
        }

        let endereço_real = redeOctetos.join(".");
        console.log(
          `O endereço de rede do host ${this.endereco_ip} é ${endereço_real}`
        );

        this.endereco_ip_rede = endereço_real;
        return endereço_real;
      }
      return null;
    },
    endereco_redeReal(endereco_ip, mascara) {
      if (
        this.enderecoIpEhValido(endereco_ip) &&
        this.enderecoIpEhValido(mascara)
      ) {
        let enderecoOctetos = endereco_ip.split(".");
        let mascaraOctetos = mascara.split(".");

        for (let i = 0; i < 4; i++) {
          enderecoOctetos[i] = parseInt(enderecoOctetos[i]);
          mascaraOctetos[i] = parseInt(mascaraOctetos[i]);
        }

        let redeOctetos = [];

        for (let i = 0; i < 4; i++) {
          redeOctetos.push(enderecoOctetos[i] & mascaraOctetos[i]);
        }

        let endereço_real = redeOctetos.join(".");
        console.log(
          `O endereço de rede do host ${endereco_ip} é ${endereço_real}`
        );

        //this.endereco_ip_rede = endereço_real;
        return endereço_real;
      }
      return null;
    },
    retorna_modeloCIDR() {
      console.log(this.mascara);
      if (
        this.enderecoIpEhValido(this.endereco_ip) &&
        this.enderecoIpEhValido(this.mascara)
      ) {
        let endereco_redeReal = this.endereco_rede(
          this.endereco_ip,
          this.mascara
        );
        let mascara_em_binario = this.retorna_binario(this.mascara).split(".");

        const qtd_bit = mascara_em_binario.reduce((bit, octeto) => {
          return bit + octeto.split("1").length - 1;
        }, 0);

        let CIDR = endereco_redeReal + "/" + qtd_bit;
        this.modelo_CIDR = CIDR;

        console.log(`CIDR:${CIDR}`);

        return CIDR;
      }
    },
    retornaEnderecoIPDoCIDR() {
      let [endereçoip, mascara] = this.modelo_CIDR.split("/");
      //let redeReal = retorna
      //console.log(`Endereço de Rede:${endereçoip}`);
      
      let mascaraFinal = this.somarbits(mascara);
      let mascaraFinalFinal = this.retorna_decimal(mascaraFinal);
      let EnderecoReal = this.endereco_redeReal(endereçoip,mascaraFinalFinal)
      this.endereco_ip_rede = EnderecoReal;
      this.endereco_ip = endereçoip;
      return endereçoip;
    },
    retornaMascaraDoCIDR() {
      let [endereçoip, mascara] = this.modelo_CIDR.split("/");
      let mascara_em_binario = this.somarbits(mascara);

      let mascarf = this.retorna_decimal(mascara_em_binario);
      this.mascara = mascarf;
      return mascarf;
    },
    retorna_decimal(endereco) {
      let endereço = endereco;
      let binario = endereço.split(".");
      let decimal = [];
      for (let i = 0; i < binario.length; i++) {
        decimal.push(parseInt(binario[i], 2));
      }
      //console.log(`Endereço ${endereco} em decimal: ${decimal.join(".")}`);
      return decimal.join(".");
    },
    somarbits(prefixo_rede) {
      let prefixo = prefixo_rede;
      let mascaraBinaria = "1".repeat(prefixo) + "0".repeat(32 - prefixo);
      let octetos = mascaraBinaria.match(/.{1,8}/g).join(".");
      console.log(octetos);

      return octetos;
    },
  },
};
</script>