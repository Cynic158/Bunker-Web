<template>
  <div ref="swaggerContainer" class="swagger-div"></div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { SwaggerUIBundle } from "swagger-ui-dist";
import "swagger-ui-dist/swagger-ui.css"
import "@/styles/swagger_dark.css";

onMounted(async () => {
  try {
    SwaggerUIBundle({
      domNode: document.querySelector('.swagger-div') as HTMLElement,
      url: `${import.meta.env.VITE_APP_BASE_URL}/openapi/swagger/doc.json`,
      docExpansion: 'none',
    });
  } catch (error) {
    console.error('Error loading Swagger UI:', error);
  }
});
</script>

<style lang="scss" scoped>
.swagger-div {
  width: 100%;
  height: 100%;
  position: relative;
}
</style>
