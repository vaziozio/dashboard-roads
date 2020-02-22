# dashboard-roads
<a href="https://dashboard-roads.herokuapp.com/">Acesso ao App</a>
<img src="https://github.com/vaziozio/dashboard-roads/blob/master/dashboard_flask.png">

Projeto dashboard com análise dos dados das rodovias federais (Jan/2007-Jun/2013)

## Rodando localmente:

1. Instalar as bibliotecas necessárias com `pip install -r requirements.txt` (é necessário tem o pip instalado)
2. Acessar a pasta raiz do projeto via terminal
3. Rodar o arquivo `app.py` com o comando `python app.py`

**Obs:** Para rodar o pipeline de carregamento dos dados, é necessário excluir o arquivo `data_q1.pkl` e seu projeto deve conter os arquivos abaixo, obtidos pelo site <a href="http://www.dados.gov.br/dataset/sistema-br-brasil-boletins-de-ocorrencias-em-rodovias-federais">Sistema BR-Brasil</a> compilados com os nomes originais.


## Recursos utilizados:

- AmCharts.js - Gráficos interativos
- Boostrap.css - Estrutura da página
- Driver.js - Step-by-step guide
- Flask.py - Back-end routes
- Heroku - Deploy
- Pandas.py - Data handling
- Pickle - Persistência dos dados sumarizados

## Melhorias
- [ ] Corrigir loading de dados pros gráficos
- [ ] Adicionar on-off pro pipeline de dados
- [ ] Refatorar nome de variáveis e declarações
- [ ] Revisar organização visual em duas views

