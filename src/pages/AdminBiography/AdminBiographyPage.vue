<template>
  <div class="bg-gray-50 min-h-screen py-12">
    <div class="max-w-4xl mx-auto px-6">
      <!-- Page Titel -->
      <h1 class="text-4xl font-serif font-bold text-gray-800 text-center mb-6">
        Vita / Künstlerischer Werdegang
      </h1>
      <p class="text-gray-600 text-center mb-12">
        Hier können Sie die Vita bearbeiten und direkt eine Vorschau sehen.
      </p>

      <!-- Editor Container -->
      <div class="bg-white rounded-xl shadow-md overflow-hidden">
        <!-- Toolbar -->
        <div id="toolbar" class="bg-gray-100 border-b border-gray-300 px-4 py-2 flex flex-wrap gap-2">
          <select class="ql-header border rounded p-1">
            <option value="1"></option>
            <option value="2"></option>
            <option selected></option>
          </select>
          <button class="ql-bold px-2 py-1 rounded hover:bg-gray-200"></button>
          <button class="ql-italic px-2 py-1 rounded hover:bg-gray-200"></button>
          <button class="ql-underline px-2 py-1 rounded hover:bg-gray-200"></button>
          <button class="ql-link px-2 py-1 rounded hover:bg-gray-200"></button>
          <button class="ql-list" value="ordered" px-2 py-1 rounded hover:bg-gray-200></button>
          <button class="ql-list" value="bullet" px-2 py-1 rounded hover:bg-gray-200></button>
          <button class="ql-clean px-2 py-1 rounded hover:bg-gray-200"></button>
        </div>

        <!-- Editor -->
        <div ref="editor" class="editor p-6 min-h-[400px]"></div>
      </div>

      <!-- Vorschau -->
      <div class="mt-8 p-6 bg-white rounded-xl shadow-md">
        <h2 class="text-2xl font-semibold text-gray-800 mb-4">Vorschau</h2>
        <div v-html="content" class="prose max-w-full text-gray-700"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

const editor = ref(null);

const content = ref(`
  <h2>Thorsten Kasel</h2>
  <p><strong>Geboren:</strong> XXX in Duisburg<br>
  <strong>Lebt und arbeitet:</strong> in Duisburg</p>

  <h3>Künstlerischer Werdegang</h3>
  <ul>
    <li>2010 – 2015: Studium der Freien Kunst, Hochschule für Grafik und Buchkunst Leipzig</li>
    <li>2015 – 2017: Meisterschülerin bei Prof. Max Beispiel</li>
  </ul>

  <h3>Einzelausstellungen (Auswahl)</h3>
  <ul>
    <li>2023: „Zwischen Linien“, Galerie Blau, Berlin</li>
    <li>2021: „Verlorene Räume“, Kunsthaus Dresden</li>
    <li>2019: „Lichtfänger“, Projektraum West, Hamburg</li>
  </ul>

  <h3>Gruppenausstellungen (Auswahl)</h3>
  <ul>
    <li>2024: „Positionen der Gegenwart“, Kunstverein Leipzig</li>
    <li>2022: „Fokus Frau“, Neue Galerie Nürnberg</li>
    <li>2020: „Form und Fläche“, Kunsthalle Bremen</li>
  </ul>

  <h3>Stipendien & Auszeichnungen</h3>
  <ul>
    <li>2022: Arbeitsstipendium der Kulturstiftung des Freistaates Sachsen</li>
    <li>2020: DAAD-Reisestipendium, Island</li>
  </ul>

  <h3>Mitgliedschaften & Projekte</h3>
  <ul>
    <li>Mitglied im BBK (Bund bildender Künstlerinnen und Künstler)</li>
    <li>Seit 2021: Mitbegründerin des Künstlerkollektivs „raum_zwischen“</li>
  </ul>

  <h3>Statement</h3>
  <p>In meiner Arbeit beschäftige ich mich mit den Übergängen zwischen Erinnerung und Raum. Mittels Malerei, Installation und Zeichnung erforsche ich Fragmente des Alltäglichen und transformiere sie in poetische Bildwelten.</p>
`);

onMounted(async () => {
  await nextTick();
  if (editor.value) {
    const quill = new Quill(editor.value, {
      theme: 'snow',
      modules: { toolbar: '#toolbar' }
    });

    quill.root.innerHTML = content.value;

    quill.on('text-change', () => {
      content.value = quill.root.innerHTML;
    });
  }
});
</script>

<style scoped>
.editor {
  min-height: 400px;
  background: white;
  border-bottom-left-radius: 0.5rem;
  border-bottom-right-radius: 0.5rem;
}

.prose ul {
  list-style-type: disc;
  padding-left: 1.5rem;
}

.prose h2, .prose h3 {
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
}

.prose p {
  margin-bottom: 1rem;
}
</style>
