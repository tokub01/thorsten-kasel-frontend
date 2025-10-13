<template>
  <div class="min-h-screen bg-gray-300 px-4 py-10">
    <div class="mx-auto bg-white shadow-lg rounded-xl p-8">
      <!-- Titel -->
      <h1 class="text-4xl font-bold text-gray-800 mb-6 text-center">Vita</h1>

      <!-- Persönliche Infos -->
      <section class="mb-8">
        <h2 class="text-2xl font-semibold text-gray-700 mb-2">Persönliches</h2>
        <p class="text-gray-600">
          <strong>Geboren:</strong> 1985<br>
          <strong>Lebt und arbeitet:</strong> Berlin & Leipzig
        </p>
      </section>

      <!-- Künstlerischer Werdegang -->
      <section class="mb-8">
        <h2 class="text-2xl font-semibold text-gray-700 mb-2">Künstlerischer Werdegang</h2>
        <ul class="list-disc list-inside text-gray-600 space-y-1">
          <li>2005 – 2010: Studium der Freien Kunst, Hochschule für Grafik und Buchkunst Leipzig</li>
          <li>2010 – 2012: Meisterschüler bei Prof. Max Beispiel</li>
          <li>Seit 2012: Freischaffender Künstler und Dozent für Malerei</li>
        </ul>
      </section>

      <!-- Einzelausstellungen -->
      <section class="mb-8">
        <h2 class="text-2xl font-semibold text-gray-700 mb-2">Einzelausstellungen (Auswahl)</h2>
        <ul class="list-disc list-inside text-gray-600 space-y-1">
          <li>2024: „Farbe & Raum“, Galerie Blau, Berlin</li>
          <li>2022: „Zwischen den Linien“, Kunstverein Leipzig</li>
          <li>2020: „Lichtfänger“, Projektraum West, Hamburg</li>
        </ul>
      </section>

      <!-- Gruppenausstellungen -->
      <section class="mb-8">
        <h2 class="text-2xl font-semibold text-gray-700 mb-2">Gruppenausstellungen (Auswahl)</h2>
        <ul class="list-disc list-inside text-gray-600 space-y-1">
          <li>2025: „Positionen der Gegenwart“, Museum für Moderne Kunst, Frankfurt</li>
          <li>2023: „Form & Farbe“, Neue Galerie Nürnberg</li>
          <li>2021: „Strukturen und Flächen“, Kunsthalle Bremen</li>
        </ul>
      </section>

      <!-- Stipendien & Auszeichnungen -->
      <section class="mb-8">
        <h2 class="text-2xl font-semibold text-gray-700 mb-2">Stipendien & Auszeichnungen</h2>
        <ul class="list-disc list-inside text-gray-600 space-y-1">
          <li>2023: Arbeitsstipendium der Kulturstiftung des Freistaates Sachsen</li>
          <li>2021: DAAD-Reisestipendium, Island</li>
          <li>2019: Preis der Berliner Künstlervereinigung</li>
        </ul>
      </section>

      <!-- Mitgliedschaften & Projekte -->
      <section class="mb-8">
        <h2 class="text-2xl font-semibold text-gray-700 mb-2">Mitgliedschaften & Projekte</h2>
        <ul class="list-disc list-inside text-gray-600 space-y-1">
          <li>Mitglied im BBK (Bund Bildender Künstlerinnen und Künstler)</li>
          <li>Seit 2020: Mitbegründer eines Künstlerkollektivs „raum_zwischen“</li>
          <li>Kurator verschiedener Ausstellungsprojekte in Leipzig und Berlin</li>
        </ul>
      </section>

      <!-- Künstlerisches Statement -->
      <section class="mb-8">
        <h2 class="text-2xl font-semibold text-gray-700 mb-2">Statement</h2>
        <p class="text-gray-600">
          Die künstlerische Arbeit untersucht die Wechselwirkung zwischen Farbe, Licht und Raum.
          Mittels Malerei, Installation und Zeichnung werden alltägliche Fragmente in poetische Bildwelten transformiert.
          Inspiration wird in urbanen Landschaften, Erinnerungsspuren und der Natur gefunden.
        </p>
      </section>
    </div>
  </div>
</template>

<script setup>
// Daten sind aktuell statisch; können bei Bedarf aus Store/API geladen werden
</script>

<style scoped>
/* Optional: sanfte Scroll-Animation */
section {
  scroll-margin-top: 2rem;
}
</style>
