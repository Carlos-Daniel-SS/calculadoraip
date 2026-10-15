<template>
  <v-container class="pa-6">
    <v-row>
      <v-col cols="12">
        <h1 class="text-center pa-8">IPWebCalc</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <p class="d-flex justify-center pa-5">
          Para utilizar a calculadora, preencha DOIS campos e escolha a opção
          CALCULAR para o preenchimento dos campos vazios.
        </p>
      </v-col>
    </v-row>
    <br />

    <!-- Os campos não ficam dentro de <form>: o Enter enviaria o formulário e recarregaria a página -->
    <v-row no-gutters>
      <v-col cols="12" sm="4">
        <v-text-field v-model="enderecoRede" :rules="regrasEndereco" class="pe-2" placeholder="Ex.: 133.8.0.0"
          label="Digite o endereço de rede:" @keyup.enter="calcular()">
        </v-text-field>
      </v-col>
      <v-col cols="12" sm="4">
        <v-text-field v-model="enderecoHost" :rules="regrasEndereco" class="pe-2" placeholder="Ex.: 133.8.0.1"
          label="Digite o endereço de host:" @keyup.enter="calcular()">
        </v-text-field>
      </v-col>
      <v-col cols="12" sm="4">
        <v-text-field v-model="mascara" :rules="regrasMascara" class="pe-2" placeholder="Ex.: 255.255.255.0"
          label="Máscara:" @keyup.enter="calcular()">
        </v-text-field>
      </v-col>
    </v-row>

    <v-row no-gutters>
      <v-col cols="12" sm="6">
        <v-text-field v-model="cidr" :rules="regrasCIDR" class="pe-2" placeholder="Ex.: 133.8.0.0/24"
          label="Representação CIDR:" @keyup.enter="calcular()">
        </v-text-field>
      </v-col>
      <v-col cols="12" sm="6">
        <v-text-field v-model="enderecoBroadcast" :rules="regrasEndereco" class="pe-2" placeholder="Ex.: 133.8.0.255"
          label="Digite o endereço de broadcast:" @keyup.enter="calcular()">
        </v-text-field>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <p class="d-flex justify-center text-red" v-if="mensagemErro">
          {{ mensagemErro }}
        </p>
      </v-col>
    </v-row>

    <v-row class="d-flex justify-center">
      <v-col cols="12" sm="6" lg="3">
        <v-btn class="bg-red" width="100%" @click="limpar()">REINICIAR</v-btn>
      </v-col>
      <v-col cols="12" sm="6" lg="3">
        <v-btn class="bg-green" width="100%" @click="calcular()">CALCULAR</v-btn>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-table v-if="resultados.length" height="300px">
          <thead>
            <tr>
              <th class="text-left">Endereços</th>
              <th class="text-left">Decimal</th>
              <th class="text-left">Binário</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in resultados" :key="item.nome">
              <td>{{ item.nome }}</td>
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
import {
  calcular as calcularEnderecos,
  ipValido,
  lerCIDR,
  mascaraValida,
  paraBinario,
} from "@/utils/ip";

export default {
  name: "HomeView",

  data() {
    return {
      enderecoRede: "",
      enderecoHost: "",
      mascara: "",
      cidr: "",
      enderecoBroadcast: "",
      mensagemErro: "",
      resultados: [],
      regrasEndereco: [(valor) => !valor || ipValido(valor) || "Endereço inválido!"],
      regrasMascara: [(valor) => !valor || mascaraValida(valor) || "Máscara inválida!"],
      regrasCIDR: [
        (valor) => !valor || lerCIDR(valor) !== null || "CIDR inválido! Use o prefixo de /8 a /32.",
      ],
    };
  },
  methods: {
    calcular() {
      const { resultado, erro } = calcularEnderecos({
        rede: this.enderecoRede,
        host: this.enderecoHost,
        mascara: this.mascara,
        cidr: this.cidr,
        broadcast: this.enderecoBroadcast,
      });

      if (erro) {
        this.mensagemErro = erro;
        this.resultados = [];
        return;
      }

      this.mensagemErro = "";
      this.enderecoRede = resultado.rede;
      this.enderecoHost = resultado.host;
      this.mascara = resultado.mascara;
      this.cidr = resultado.cidr;
      this.enderecoBroadcast = resultado.broadcast;

      this.resultados = [
        this.linha("Endereço de Rede", resultado.rede),
        this.linha("Endereço de Host", resultado.host),
        this.linha("Máscara", resultado.mascara),
        this.linha("Endereço de Broadcast", resultado.broadcast),
        { nome: "Classe", decimal: resultado.classe, binario: "---" },
      ];
    },
    linha(nome, endereco) {
      if (!endereco) return { nome, decimal: "---", binario: "---" };
      return { nome, decimal: endereco, binario: paraBinario(endereco) };
    },
    limpar() {
      this.enderecoRede = "";
      this.enderecoHost = "";
      this.mascara = "";
      this.cidr = "";
      this.enderecoBroadcast = "";
      this.mensagemErro = "";
      this.resultados = [];
    },
  },
};
</script>
