<template>
  <v-container class="spacing-playground pa-6">
    <v-row>
      <v-col> </v-col>
      <v-col>
        <h1 class="text-center">{{ endereco_ip }}</h1>
      </v-col>
      <v-col></v-col>
    </v-row>
    <br />

    <v-row no-gutters>
      <v-col>
        <form>
          <v-text-field
            v-model="endereco_ip"
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
            class="pe-2"
            placeholder="Ex.: 133.8.0.255"
            label="Digite o endereço de broadcast:"
          >
          </v-text-field>
        </form>
      </v-col>
      <v-col>
        <form>
          <v-text-field
            class="pe-2"
            placeholder="Ex.: 16"
            label="N° de sub-redes a serem ciradas:"
          >
          </v-text-field>
        </form>
      </v-col>
    </v-row>

    <v-row>
      <v-col> </v-col>
      <v-col align="center" jutify="center">
        <v-btn class="bg-green" width="100%" @click="retorna_binario()"
          >Calcular</v-btn
        >
      </v-col>
      <v-col></v-col>
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
    };
  },
  methods: {
    retorna_binario() {
      console.log(this.endereco_ip);

      if (
        this.enderecoIpEhValido(this.endereco_ip) &&
        this.enderecoIpEhValido(this.mascara)
      ) {
        let partes_ip = this.endereco_ip.split(".");
        let binario = [];

        for (let i = 0; i < partes_ip.length; i++) {
          let endereço_decimal = parseInt(partes_ip[i]);
          let endereço_binario = endereço_decimal.toString(2).padStart(8, "0");

          binario.push(endereço_binario);
        }

        console.log(binario.join("."));
      }
      return null;
    },
    enderecoIpEhValido(enderecoIP) {
      let regex =
        /^([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/;
      return regex.test(enderecoIP);
    },
  },
};
</script>
