<template>
  <v-container class="spacing-playground pa-6">
    <v-row>
      <v-col cols="12">
        <h1 class="text-center pa-8">Calculadora IPv4</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <p class="d-flex justify-center pa-5">
          Para utilizar a calculadora, preencha DOIS campos e escolha a
          opção CALCULAR para o preenchimento dos campos vazios.
        </p>
      </v-col>
    </v-row>
    <br />

    <v-row no-gutters>
      <v-col cols="12" sm="4">
        <form>
          <v-text-field
            v-model="endereco_ip_rede"
            :rules="endereco_ip_rede.length > 0 ? enderecoIPRules : []"
            class="pe-2"
            placeholder="Ex.: 133.8.0.0"
            label="Digite o endereço de rede:"
          >
          </v-text-field>
        </form>
      </v-col>
      <v-col cols="12" sm="4">
        <form>
          <v-text-field
            v-model="endereco_ip"
            :rules="endereco_ip.length > 0 ? enderecoIPRules : []"
            :disabled="endereco_ip_rede.length != 0"
            class="pe-2"
            placeholder="Ex.: 133.8.0.1"
            label="Digite o endereço de host:"
          >
          </v-text-field>
        </form>
      </v-col>
      <v-col cols="12" sm="4">
        <form>
          <v-text-field
            v-model="mascara"
            :rules="mascara.length > 0 ? mascaraRules : []"
            class="pe-2"
            placeholder="Ex.: 255.255.255.0"
            label="Máscara:"
          >
          </v-text-field>
        </form>
      </v-col>
    </v-row>

    <v-row no-gutters>
      <v-col cols="12" sm="6">
        <form>
          <v-text-field
            v-model="modelo_CIDR"
            :rules="modelo_CIDR.length > 0 ? modelo_CIDRRules : []"
            class="pe-2"
            placeholder="Ex.: 133.8.0.0/24"
            label="Representação CIDR:"
          >
          </v-text-field>
        </form>
      </v-col>
      <v-col cols="12" sm="6">
        <form>
          <v-text-field
            v-model="endereco_broadcast"
            :rules="endereco_broadcast.length > 0 ? enderecoIPRules : []"
            :disabled="endereco_ip.length != 0"
            class="pe-2"
            placeholder="Ex.: 133.8.0.255"
            label="Digite o endereço de broadcast:"
          >
          </v-text-field>
        </form>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <p class="d-flex justify-center text-red" v-if="exibirMensagem">
          Endereços inválidos ou não compatíveis !
        </p>
      </v-col>
    </v-row>

    <v-row class="d-flex justify-center">
      <v-col cols="12" sm="6" lg="3">
        <v-btn class="bg-red" width="100%" @click="Limpar()">REINICIAR</v-btn>
      </v-col>
      <v-col cols="12" sm="6" lg="3">
        <v-btn class="bg-green" width="100%" @click="CalculaTodos()"
          >CALCULAR</v-btn
        >
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-table v-if="mostrarTabela" height="300px">
          <thead>
            <tr>
              <th class="text-left">Endereços</th>
              <th class="text-left">Decimal</th>
              <th class="text-left">Binário</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in desserts" :key="item.name">
              <td>{{ item.name }}</td>
              <td>{{ item.decimal }}</td>
              <td>{{ item.binario }}</td>
            </tr>
          </tbody>
        </v-table>
      </v-col>
    </v-row>
  </v-container>
</template>


<script>
export default {
  name: "HomeView",

  data() {
    return {
      mostrarTabela: false,
      endereco_ip_rede: "",
      endereco_ip: "",
      mascara: "",
      modelo_CIDR: "",
      endereco_broadcast: "",
      exibirMensagem: false,
      desserts: [
        {
          name: "Endereço de Rede",
          decimal: "",
          binario: "",
        },
        {
          name: "Endereço de Host",
          decimal: "",
          binario: "",
        },
        {
          name: "Máscara",
          decimal: "",
          binario: "",
        },
        {
          name: "Endereço de Broadcast",
          decimal: "",
          binario: "",
        },
        {
          name: "Classe",
          decimal: "",
          binario: "",
        },
      ],
      enderecoIPRules: [
        (value) =>
          /^([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/.test(
            value
          ) || "Endereço inválido!",
      ],
      mascaraRules: [
        (value) =>
          /^(255|254|252|248|240|224|192|128|0)\.(255|254|252|248|240|224|192|128|0)\.(255|254|252|248|240|224|192|128|0)\.(255|254|252|248|240|224|192|128|0)$/.test(
            value
          ) || "Máscara Inválida!",
      ],
      modelo_CIDRRules: [
        (value) =>
          /^(\d{1,3}\.){3}\d{1,3}\/(3[0-2]|[1-2]?[0-9]|8)$/.test(value) ||
          "Endereço CIDR inválido!",
      ],
    };
  },
  methods: {
    CalculaTodos() {
      let rede = this.endereco_ip_rede;
      let host = this.endereco_ip;
      let mask = this.mascara;
      let CIDR = this.modelo_CIDR;
      let enderecoBroadcast = this.endereco_broadcast;
      
      if (this.enderecoIpEhValido(rede)) {
        
        if (this.validaMascara(mask) && this.validaRedeMascara(rede, mask)) {
          rede = this.calculaRede(rede, mask);
          enderecoBroadcast = this.calculaBroadcast(rede, mask);
          CIDR = this.calculaCIDR(rede, mask);
          
          this.endereco_ip = host;
          this.endereco_ip_rede = rede;
          this.mascara = mask;
          this.modelo_CIDR = CIDR;
          this.endereco_broadcast = enderecoBroadcast;

          this.desserts = [
            {
              name: "Endereço de Rede",
              decimal: rede,
              binario: this.calculaBinario(rede),
            },
            {
              name: "Endereço de Host",
              decimal: host,
              binario: this.calculaBinario(host),
            },
            {
              name: "Máscara",
              decimal: mask,
              binario: this.calculaBinario(mask),
            },
            {
              name: "Endereço de Broadcast",
              decimal: enderecoBroadcast,
              binario: this.calculaBinario(enderecoBroadcast),
            },
            {
              name: "Classe",
              decimal: this.calculaClasse(rede),
              binario: "---",
            },
          ];
          this.mostrarTabela = true;
          this.exibirMensagem = false;

        }
        //verifica o endereço CIDR
        else if (this.validaCIDR(CIDR) && rede == this.calculaEnderecoComCIDR(CIDR)) {
          rede = this.calculaEnderecoComCIDR(CIDR);
          mask = this.calculaMascaraComCIDR(CIDR);
          enderecoBroadcast = this.calculaBroadcastComCIDR(CIDR);

          this.endereco_ip_rede = rede;
          this.endereco_ip = host;
          this.mascara = mask;
          this.modelo_CIDR = CIDR;
          this.endereco_broadcast = enderecoBroadcast;
          this.desserts = [
            {
              name: "Endereço de Rede",
              decimal: rede,
              binario: this.calculaBinario(rede),
            },
            {
              name: "Endereço de Host",
              decimal: host,
              binario: this.calculaBinario(host),
            },
            {
              name: "Máscara",
              decimal: mask,
              binario: this.calculaBinario(mask),
            },
            {
              name: "Endereço de Broadcast",
              decimal: enderecoBroadcast,
              binario: this.calculaBinario(enderecoBroadcast),
            },
            {
              name: "Classe",
              decimal: this.calculaClasse(rede),
              binario: "---",
            },
          ];
          this.mostrarTabela = true;
          this.exibirMensagem = false;

        }
        //verifica o endereço de broadcast
        else if (this.validaBroadcast(rede, enderecoBroadcast)) {
          mask = this.calculaMascaraComBroadcast(rede, enderecoBroadcast);
          console.log(`mascara: ${mask}`);
          CIDR = this.calculaCIDR(rede, mask);

          this.endereco_ip_rede = rede;
          this.endereco_ip = host;
          this.mascara = mask;
          this.modelo_CIDR = CIDR;
          this.endereco_broadcast = enderecoBroadcast;
          this.desserts = [
            {
              name: "Endereço de Rede",
              decimal: rede,
              binario: this.calculaBinario(rede),
            },
            {
              name: "Endereço de Host",
              decimal: host,
              binario: this.calculaBinario(host),
            },
            {
              name: "Máscara",
              decimal: mask,
              binario: this.calculaBinario(mask),
            },
            {
              name: "Endereço de Broadcast",
              decimal: enderecoBroadcast,
              binario: this.calculaBinario(enderecoBroadcast),
            },
            {
              name: "Classe",
              decimal: this.calculaClasse(rede),
              binario: "---",
            },
          ];
          this.mostrarTabela = true;
          this.exibirMensagem = false;
        } 
        else {
          this.exibirMensagem = true;
        }
      }
      // verifica endereço de host
      else if (this.enderecoIpEhValido(host)) {
        //verifica mascara
        if (this.validaMascara(mask)) {
          rede = this.calculaRede(host, mask);
          CIDR = this.calculaCIDR(host, mask);
          enderecoBroadcast = this.calculaBroadcast(host, mask);

          this.endereco_ip_rede = rede;
          this.endereco_ip = host;
          this.mascara = mask;
          this.modelo_CIDR = CIDR;
          this.endereco_broadcast = enderecoBroadcast;
          this.desserts = [
            {
              name: "Endereço de Rede",
              decimal: rede,
              binario: this.calculaBinario(rede),
            },
            {
              name: "Endereço de Host",
              decimal: host,
              binario: this.calculaBinario(host),
            },
            {
              name: "Máscara",
              decimal: mask,
              binario: this.calculaBinario(mask),
            },
            {
              name: "Endereço de Broadcast",
              decimal: enderecoBroadcast,
              binario: this.calculaBinario(enderecoBroadcast),
            },
            {
              name: "Classe",
              decimal: this.calculaClasse(rede),
              binario: "---",
            },
          ];
          this.mostrarTabela = true;
          this.exibirMensagem = false;
        }
        //verifica o endereço CIDR
        else if (this.validaCIDR(CIDR)) {
          let redecid = this.calculaEnderecoComCIDR(CIDR);
          mask = this.calculaMascaraComCIDR(CIDR);
          rede = this.calculaRede(host, mask);

          if (rede == redecid) {

            enderecoBroadcast = this.calculaBroadcast(host, mask);

            this.endereco_ip_rede = rede;
            this.endereco_ip = host;
            this.mascara = mask;
            this.modelo_CIDR = CIDR;
            this.endereco_broadcast = enderecoBroadcast;
            this.desserts = [
              {
                name: "Endereço de Rede",
                decimal: rede,
                binario: this.calculaBinario(rede),
              },
              {
                name: "Endereço de Host",
                decimal: host,
                binario: this.calculaBinario(host),
              },
              {
                name: "Máscara",
                decimal: mask,
                binario: this.calculaBinario(mask),
              },
              {
                name: "Endereço de Broadcast",
                decimal: enderecoBroadcast,
                binario: this.calculaBinario(enderecoBroadcast),
              },
              {
                name: "Classe",
                decimal: this.calculaClasse(rede),
                binario: "---",
              },
            ];
            this.mostrarTabela = true;
            this.exibirMensagem = false;
          }
          else {
            this.exibirMensagem = true;
          }
        } 
        else {
          this.exibirMensagem = true;
        }

      } 
      // verifica a mascara
      else if (this.validaMascara(mask)) {

        //verifica endereço CIDR e se os campos dos CIDR são válidos
        if (this.validaCIDR(CIDR) && mask === this.calculaMascaraComCIDR(CIDR) && this.calculaEnderecoComCIDR(CIDR) != false) {

          rede = this.calculaEnderecoComCIDR(CIDR);
          enderecoBroadcast = this.calculaBroadcastComCIDR(CIDR);

          this.endereco_ip_rede = rede;
          this.endereco_ip = host;
          this.mascara = mask;
          this.modelo_CIDR = CIDR;
          this.endereco_broadcast = enderecoBroadcast;
          
          this.desserts = [
            {
              name: "Endereço de Rede",
              decimal: rede,
              binario: this.calculaBinario(rede),
            },
            {
              name: "Endereço de Host",
              decimal: host,
              binario: this.calculaBinario(host),
            },
            {
              name: "Máscara",
              decimal: mask,
              binario: this.calculaBinario(mask),
            },
            {
              name: "Endereço de Broadcast",
              decimal: enderecoBroadcast,
              binario: this.calculaBinario(enderecoBroadcast),
            },
            {
              name: "Classe",
              decimal: this.calculaClasse(rede),
              binario: "---",
            },
          ];
          this.mostrarTabela = true;
        } 
        
        else {
          this.exibirMensagem = true;
        }
      }
      else {
        this.exibirMensagem = true;
      }
    },
    Limpar() {
      this.endereco_ip_rede = "";
      this.endereco_ip = "";
      this.mascara = "";
      this.modelo_CIDR = "";
      this.endereco_broadcast = "";
      this.mostrarTabela = false;
      this.exibirMensagem = false;
    },
    enderecoIpEhValido(enderecoIP) {
      let regex =
        /^([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/;
      return regex.test(enderecoIP);
    },
    validaMascara(mascara) {
      let masc = this.calculaBinario(mascara);
      let zero = 0;

      if (masc.length !== 35) {
        return false;
      }

      if (masc.slice(0, 8) !== "11111111") {
        return false;
      }

      for (let i = 9; i < masc.length; i++) {
        const c = masc[i];

        if (c === "1" && c !== "." && zero !== 0) {
          return false;
        } else if (c === "0") {
          zero += 1;
        }
      }

      return true;
    },
    validaCIDR(modeloCIDR) {
      let regexCIDR = /^(\d{1,3}\.){3}\d{1,3}\/\d{1,2}$/;
      if (!regexCIDR.test(modeloCIDR)) {
        return false;
      }
      let [enderecoip, mascara] = modeloCIDR.split("/");
      let mascaraCIDR = parseInt(mascara);
      if (!this.enderecoIpEhValido(enderecoip)) {
        return false;
      }

      if (mascaraCIDR < 8 || mascaraCIDR > 32) {
        return false;
      }
      return true;
    },
    validaBroadcast(rede, broadcast) {
      
      if (this.enderecoIpEhValido(broadcast)) {

        let enderecoOctetos = rede.split(".").map(Number);
        let broadcastOctetos = broadcast.split(".").map(Number);

        for (let i = 0; i < enderecoOctetos.length; i++) {

          if (enderecoOctetos[i] != broadcastOctetos[i]) {

            let numeroChave = broadcastOctetos[i] + 1;
            let loga = Math.log2(numeroChave);
            //console.log(`numero: ${numeroChave}, ${loga}`);

            if (Number.isInteger(loga)) {
              return true;
            }
            return false;
          }
        }
      }
    },
    validaRedeMascara(rede, mascara) {
      let redeCompara = this.calculaRede(rede, mascara);
      if (redeCompara != rede) {
        return false;
      }
      return true;
    },
    calculaRede(enderecoIP, mascara) {
      if (this.enderecoIpEhValido(enderecoIP) && this.validaMascara(mascara)) {

        let enderecoOctetos = enderecoIP.split(".").map(Number);
        let mascaraOctetos = mascara.split(".").map(Number);
        let redeOctetos = [];

        for (let i = 0; i < 4; i++) {
          redeOctetos.push(enderecoOctetos[i] & mascaraOctetos[i]);
        }

        let endereço_real = redeOctetos.join(".");
        return endereço_real;
      }
      return false;
    },
    calculaBroadcast(enderecoIP, mascara) {
      if (this.enderecoIpEhValido(enderecoIP) && this.validaMascara(mascara)) {

        let endereRede = this.calculaRede(enderecoIP, mascara);
        let enderecoOctetos = endereRede.split(".").map(Number);
        let mascaraOctetos = mascara.split(".").map(Number);
        let broadcastOctetos = [];

        for (let i = 0; i < 4; i++) {

          broadcastOctetos.push(enderecoOctetos[i] | (255 - mascaraOctetos[i]));

        }

        let broadcast = broadcastOctetos.join(".");
        return broadcast;
      }
      return false;
    },
    calculaCIDR(enderecoHost, mascaraHost) {
      if (
        this.enderecoIpEhValido(enderecoHost) &&
        this.validaMascara(mascaraHost)
      ) {
        
        let endereco_rede = this.calculaRede(enderecoHost, mascaraHost);
        let mascara_em_binario = this.calculaBinario(mascaraHost).split(".");

        const qtd_bit = mascara_em_binario.reduce((bit, octeto) => {
          return bit + octeto.split("1").length - 1;
        }, 0);
        return endereco_rede + "/" + qtd_bit;
      }
      return false;
    },
    calculaEnderecoComCIDR(modeloCIDR) {
      let [endereçoip, mascara] = modeloCIDR.split("/");
      let mascara_em_Decimal = this.calculaMascaraComCIDR(modeloCIDR);
      let rede = this.calculaRede(endereçoip, mascara_em_Decimal);
      //console.log(`Endereço de Rede:${rede}, mscara:${mascara_em_Decimal}`);
      if (rede !== endereçoip) {
        return false;
      }
      return rede;
    },
    calculaMascaraComCIDR(modeloCIDR) {
      if (this.validaCIDR(modeloCIDR)) {
        let [endereçoip, mascara] = modeloCIDR.split("/");
        let mascara_em_Decimal = this.calculaBits(mascara);

        //console.log(`mascara: ${mascara_em_Decimal}`);
        return mascara_em_Decimal;
      }
      return false;
    },
    calculaBroadcastComCIDR(modeloCIDR) {
      let [endereçoip, mascara] = modeloCIDR.split("/");
      let mascaraDecimal = this.calculaBits(mascara);
      let broadcast = this.calculaBroadcast(endereçoip, mascaraDecimal);
      return broadcast;
    },
    calculaMascaraComBroadcast(enderecoHost, broadcast) {
      if (
        this.enderecoIpEhValido(enderecoHost) &&
        this.validaBroadcast(enderecoHost, broadcast)
      ) {
        let enderecoOctetos = enderecoHost.split(".").map(Number);
        let broadcastOctetos = broadcast.split(".").map(Number);
        let mascaratOctetos = [];
        let quantidade = 0;
        //console.log(`rede: ${enderecoOctetos}; broadcast: ${broadcastOctetos}, tamanho: ${broadcastOctetos.length}`)
        for (let i = 0; i < broadcastOctetos.length; i++) {
          //console.log(`sequencia: ${enderecoOctetos[i]}, ${broadcastOctetos[i]}`)

          if (enderecoOctetos[i] !== broadcastOctetos[i]) {
            //console.log(`contador:${broadcastOctetos[i]}, endereço:${enderecoOctetos[i]}`);
            mascaratOctetos.push(255 - broadcastOctetos[i]);
          } else {
            mascaratOctetos.push(
              255 - (broadcastOctetos[i] - enderecoOctetos[i])
            );
          }
        }

        let mascara = mascaratOctetos.join(".");
        return mascara;
      }
      return false;
    },
    calculaClasse(endereco) {
      if (this.enderecoIpEhValido(endereco)) {
        let endereço_em_binário = this.calculaBinario(endereco);
        let dividir_octetos = endereço_em_binário.split(".");

        let primeiro_bit = dividir_octetos[0].slice(0, 1);
        let segundo_bit = dividir_octetos[0].slice(0, 2);
        let terceiro_bit = dividir_octetos[0].slice(0, 3);

        let classe = "";
        if (primeiro_bit === "0") {
          classe = `Pertence a classe A --> ${primeiro_bit}`;
        } else if (segundo_bit === "10") {
          classe = `Pertence a classe B --> ${segundo_bit}`;
        } else if (terceiro_bit === "110") {
          classe = `Pertence a classe C --> ${terceiro_bit}`;
        } else {
          classe = `Classe não identificada`;
        }
        return classe;
      }
      return false;
    },
    calculaBinario(endereço) {
      if (this.enderecoIpEhValido(endereço)) {
        let partes_ip = endereço.split(".");
        let binario = [];

        for (let i = 0; i < partes_ip.length; i++) {
          let endereço_decimal = parseInt(partes_ip[i]);
          let endereço_binario = endereço_decimal.toString(2).padStart(8, "0");

          binario.push(endereço_binario);
        }
        let enderecoBinario = binario.join(".");
        return enderecoBinario;
      }
      return false;
    },
    calculaBits(prefixo_rede) {
      //console.log(`prefixo: ${prefixo_rede}`)
      if (prefixo_rede < 8 || prefixo_rede > 32) {
        return false;
      }
      let prefixo = prefixo_rede;
      let mascaraBinaria = "1".repeat(prefixo) + "0".repeat(32 - prefixo);
      let octetos = mascaraBinaria.match(/.{1,8}/g).join(".");
      let mascaraDecimal = this.calculaDecimal(octetos);
      return mascaraDecimal;
    },
    calculaDecimal(binario) {
      let enderecoB = binario.split(".");
      let decimal = [];

      for (let i = 0; i < 4; i++) {
        decimal.push(parseInt(enderecoB[i], 2));
      }

      return decimal.join(".");
    },
  },
};
</script>