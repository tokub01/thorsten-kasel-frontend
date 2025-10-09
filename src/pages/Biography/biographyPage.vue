<template>
  <div class="min-h-screen bg-gray-100 px-4 py-10">
    <div class="max-w-5xl mx-auto bg-white shadow-lg rounded-xl p-8">
      <!-- Titel -->
      <h1 class="text-4xl font-bold text-gray-800 mb-6 text-center">Vita</h1>

      <!-- Persönliche Infos -->
      <section class="mb-8">
        <h2 class="text-2xl font-semibold text-gray-700 mb-2">Persönliches</h2>
        <p class="text-gray-600">
          <strong>Name:</strong> Thorsten Kasel<br>
          <strong>Geboren:</strong> Duisburg<br>
          <strong>Lebt und arbeitet:</strong> Duisburg
        </p>
      </section>

      <!-- Künstlerischer Werdegang -->
      <section class="mb-8">
        <h2 class="text-2xl font-semibold text-gray-700 mb-2">Künstlerischer Werdegang</h2>
        <ul class="list-disc list-inside text-gray-600 space-y-1">
          <li>2010 – 2015: Studium der Freien Kunst, Hochschule für Grafik und Buchkunst Leipzig</li>
          <li>2015 – 2017: Meisterschülerin bei Prof. Max Beispiel</li>
        </ul>
      </section>

      <!-- Ausstellungen -->
      <section class="mb-8">
        <h2 class="text-2xl font-semibold text-gray-700 mb-2">Einzelausstellungen (Auswahl)</h2>
        <ul class="list-disc list-inside text-gray-600 space-y-1">
          <li>2023: „Zwischen Linien“, Galerie Blau, Berlin</li>
          <li>2021: „Verlorene Räume“, Kunsthaus Dresden</li>
          <li>2019: „Lichtfänger“, Projektraum West, Hamburg</li>
        </ul>
      </section>

      <!-- Gruppenausstellungen -->
      <section class="mb-8">
        <h2 class="text-2xl font-semibold text-gray-700 mb-2">Gruppenausstellungen (Auswahl)</h2>
        <ul class="list-disc list-inside text-gray-600 space-y-1">
          <li>2024: „Positionen der Gegenwart“, Kunstverein Leipzig</li>
          <li>2022: „Fokus Frau“, Neue Galerie Nürnberg</li>
          <li>2020: „Form und Fläche“, Kunsthalle Bremen</li>
        </ul>
      </section>

      <!-- Stipendien & Auszeichnungen -->
      <section class="mb-8">
        <h2 class="text-2xl font-semibold text-gray-700 mb-2">Stipendien & Auszeichnungen</h2>
        <ul class="list-disc list-inside text-gray-600 space-y-1">
          <li>2022: Arbeitsstipendium der Kulturstiftung des Freistaates Sachsen</li>
          <li>2020: DAAD-Reisestipendium, Island</li>
        </ul>
      </section>

      <!-- Mitgliedschaften & Projekte -->
      <section class="mb-8">
        <h2 class="text-2xl font-semibold text-gray-700 mb-2">Mitgliedschaften & Projekte</h2>
        <ul class="list-disc list-inside text-gray-600 space-y-1">
          <li>Mitglied im BBK (Bund bildender Künstlerinnen und Künstler)</li>
          <li>Seit 2021: Mitbegründerin des Künstlerkollektivs „raum_zwischen“</li>
        </ul>
      </section>

      <!-- Künstlerisches Statement -->
      <section class="mb-8">
        <h2 class="text-2xl font-semibold text-gray-700 mb-2">Statement</h2>
        <p class="text-gray-600">
          In meiner Arbeit beschäftige ich mich mit den Übergängen zwischen Erinnerung und Raum.
          Mittels Malerei, Installation und Zeichnung erforsche ich Fragmente des Alltäglichen und transformiere
          sie in poetische Bildwelten.
        </p>
      </section>
    </div>
  </div>
</template>

<script setup>
// Optional: Daten dynamisch laden aus Store oder API
</script>

<style scoped>
/* Optional: sanfte Animation beim Scrollen */
section {
  scroll-margin-top: 2rem;
}
</style>
