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
        <v-btn class="bg-green" width="100%"
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
  
};
</script>
