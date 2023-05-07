<template>
  <v-card
    class="mx-auto"
    max-width="300"
  >
    <v-list density="compact">
      <v-list-subheader>REPORTS</v-list-subheader>

      <v-list-item
        v-for="(item, i) in items"
        :key="i"
        :value="item"
        active-color="primary"
      >
        <template v-slot:prepend>
          <v-icon :icon="item.icon"></v-icon>
        </template>

        <v-list-item-title></v-list-item-title>
      </v-list-item>
    </v-list>
  </v-card>
</template>
