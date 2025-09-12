<template>
  <div class="biography-editor">
  <label for="biography">Vita</label>

    <!-- Toolbar -->
    <div id="toolbar">
      <select class="ql-header">
        <option value="1"></option>
        <option value="2"></option>
        <option selected></option>
      </select>
      <button class="ql-bold"></button>
      <button class="ql-italic"></button>
      <button class="ql-underline"></button>
      <button class="ql-link"></button>
      <button class="ql-list" value="ordered"></button>
      <button class="ql-list" value="bullet"></button>
      <button class="ql-clean"></button>
    </div>

    <!-- Editor -->
    <div ref="editor" class="editor"></div>

    <!-- Vorschau -->
    <div class="preview">
      <h3>Vorschau:</h3>
      <div v-html="content"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

const editor = ref(null);

// Beispielhafte künstlerische Vita
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
      modules: {
        toolbar: '#toolbar'
      },
    });

    // Startinhalt setzen
    quill.root.innerHTML = content.value;

    // Inhalt live aktualisieren
    quill.on('text-change', () => {
      content.value = quill.root.innerHTML;
    });
  }
});
</script>

<style scoped>
.biography-editor {
  max-width: 800px;
  margin: 2rem auto;
  font-family: Arial, sans-serif;
}

label {
  display: block;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

#toolbar {
  border: 1px solid #ccc;
  border-bottom: none;
  border-radius: 4px 4px 0 0;
  background: #f5f5f5;
  padding: 8px;
}

.editor {
  border: 1px solid #ccc;
  border-top: none;
  min-height: 300px;
  border-radius: 0 0 4px 4px;
  background: white;
  padding: 12px;
}

.preview {
  margin-top: 2rem;
  padding: 1rem;
  border-top: 1px solid #ddd;
  background: #fafafa;
}
</style>
