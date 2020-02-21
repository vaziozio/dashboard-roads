import pandas as pd
import pickle as pkl


def get_ocoloc_data():
    df_oco = pd.read_csv("data/ocorrencia.csv", sep=';')

    analysis_start = "2007-01-01"
    analysis_end = "2013-06-31"

    df_oco = df_oco[(df_oco['ocodataocorrencia'] >= analysis_start) & (df_oco['ocodataocorrencia'] <= analysis_end)]
    df_oco = df_oco[(df_oco['ocodataregistro'] >= analysis_start) & (df_oco['ocodataregistro'] <= analysis_end)]
    df_oco = df_oco[(df_oco['ocodatafim'] >= analysis_start) & (df_oco['ocodatafim'] <= analysis_end)]

    df_oco["ocodataocorrencia"] = pd.to_datetime(df_oco["ocodataocorrencia"])
    df_oco["ocodataregistro"] = pd.to_datetime(df_oco["ocodataregistro"])
    df_oco["ocodatafim"] = pd.to_datetime(df_oco["ocodatafim"])

    df_oco = df_oco.drop(['ocostatus', 'ocomunicipio', 'ocosentido', 'ocodataregistro',
                          'ocotipo', 'ococomid', 'ocoidorigem', 'ocodatafim'], axis=1)

    df_loc = pd.read_csv("data/localbr.csv", sep=';')

    df_oco_loc = pd.merge(left=df_oco, right=df_loc, left_on='ocolocal', right_on='lbrid')

    return df_oco_loc


def get_vehicle_data():
    df_ocoveic = pd.read_csv('data/ocorrenciaveiculo.csv',
                             names=['ocvid', 'ocvocoid', 'ocvveiid', 'extra'],
                             sep='|',
                             skiprows=1) \
        .drop(['extra'], axis=1) \
        .drop_duplicates()
    #
    # df_veiculo_final = pd.merge(right=df_ocoveic, left=df_oco, right_on='ocvocoid', left_on='ocoid')
    #
    # # getting top1 info
    # vehicle_data['ocorrencia_top1_veiculos'] = df_veiculo_final['ocvocoid'].value_counts().index.tolist()[0]
    # vehicle_data['n_veiculos_top1'] = df_veiculo_final['ocvocoid'].value_counts().values.tolist()[0]
    # vehicle_data['total_oco'] = len(df_veiculo_final['ocvveiid'].unique())

    return df_ocoveic


def get_people_data():
    df_ocopes = pd.read_csv('data/ocorrenciapessoa.csv', sep=';') \
        .drop_duplicates().drop(['opeportenumero', 'opeportevalidade', 'opettecodigo',
                                 'openaoident', 'opeestrangeiro', 'opeanexo', 'opecondalegadas'], axis=1)

    return df_ocopes


def get_all_data():
    df_oco = get_ocoloc_data()
    df_pes = get_people_data()
    df_veic = get_vehicle_data()

    df_final_veic = pd.merge(right=df_veic, left=df_oco, right_on='ocvocoid', left_on='ocoid')
    df_final_pes = pd.merge(right=df_pes, left=df_oco, right_on='opeocoid', left_on='ocoid')

    return df_final_pes, df_final_veic

def load_data():

    try:
        data_dict = pkl.load(open('data_q1.pkl', 'rb'))
    except:
        # declaring data recipient
        data_dict = dict(veic_data={},
                         pes_data={},
                         road_data={})

        data = get_all_data()

        df_pes, df_veic = data

        # handling vehicle data
        data_dict['veic_data']['ocorrencia_top1_veiculos'] = df_veic['ocvocoid'].value_counts().index.tolist()[0]
        data_dict['veic_data']['top1_n_veiculos'] = df_veic['ocvocoid'].value_counts().values.tolist()[0]
        data_dict['veic_data']['n_oco_veic'] = len(df_veic['ocvocoid'].unique())

        #handling people data
        data_dict['pes_data']['ocorrencia_top1_pessoas'] = df_pes['opeocoid'].value_counts().index.tolist()[0]
        data_dict['pes_data']['top1_n_pessoas'] = df_pes['opeocoid'].value_counts().values.tolist()[0]
        data_dict['pes_data']['n_oco_pessoas'] = len(df_pes['opeocoid'].unique())

        #handling person chart data
        df_pes.index = df_pes['ocodataocorrencia']
        df_pes = df_pes.resample('Y').count()
        data_dict['pes_data']['years'] = []

        #handling person year data
        for i in range(len(df_pes['ocoid'])):
            year = df_pes['ocoid'].index[i].year
            n_val = df_pes['ocoid'][i]
            year_dict = dict(name=str(year), value=int(n_val))
            data_dict['pes_data']['years'].append(year_dict)

        #handling roads year data
        data_dict['years'] = {}
        estados = ['_' + estado for estado in df_veic['lbruf'].value_counts().index.tolist()]
        df_estado = pd.get_dummies(df_veic, prefix='', columns=["lbruf"])
        df_estado.index = df_estado['ocodataocorrencia']
        df_estado_grouped = df_estado[estados].resample('Y').sum()
        df_estado_grouped.columns = [estado.replace('_', '') for estado in estados]
        df_estado_grouped.index = df_estado_grouped.index.year.map(str)
        data_dict['road_data'] = df_estado_grouped.T.to_dict()

        for year in df_estado_grouped.index:
            data_dict['years'][str(year)] = []
            for i in range(len(estados)):
                if df_estado_grouped.loc[year][i] > 5000:
                    data_dict['years'][str(year)].append(
                        {'network': df_estado_grouped.loc[year].index[i], 'MAU': df_estado_grouped.loc[year][i]})

        pkl.dump(data_dict, open("data_q1.pkl", "wb"))

    return data_dict









