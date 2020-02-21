$(document).ready( function() {
    const driver = new Driver();

    // Define the steps for introduction
    driver.defineSteps([
      {
        element: '#person1',
        popover: {
          className: 'first-step-popover-class',
          title: '1. Top 1 Ocorrência de pessoas',
          description: 'Ocorrência com maior número de pessoas envolvidas associadas a um único ID.',
          position: 'right'
        }
      },
      {
        element: '#person2',
        popover: {
          title: '2. Total de ocorrências',
          description: 'Número de ocorrências com pessoas/veículos no período.',
          position: 'bottom'
        }
      },
      {
        element: '#card-person',
        popover: {
          title: '3. Gráficos Informativos',
          description: 'Gráficos interativos com informações sumarizadas por ano. Clique sobre a cor das legendas para filtrar.',
          position: 'right'
        }
      }
    ]);

    // Start the introduction
    driver.start();

})