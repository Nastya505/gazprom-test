import React from 'react';

import axios from 'axios';

import { ChoiceGroup } from '@consta/uikit/ChoiceGroup';
import { Theme, presetGpnDefault } from '@consta/uikit/Theme';

import { ReactECharts } from '../Echarts/ReactECharts';

import Loading  from '../Loading';

import './App.css';



// Интерфейс данных
interface IData {
  date: string;
  month: string;
  indicator: string;
  value: number;
}

const API = 'https://65d4ae1a3f1ab8c63435bc4b.mockapi.io/api/data';

// массив валют
const currencies: string[] = ['Курс доллара', 'Курс евро', 'Курс юаня'];

function App() {
  // создание стейта для записи данных
  const [data, setData] = React.useState<IData[]>([]);
  const [loading, setLoading] = React.useState(true);

  // получение данных c API
  const getData = async () => {
    try {
      const response = await axios.get(API);
      setData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data: ', error);
      setLoading(false);
    }
  };

  // выбор валюты
  const [valueChoice, setValueChoice] = React.useState<string>(currencies[0]);

  // фильтрация данных
  const filteredValues = data
    .filter((d) => d.indicator === valueChoice)
    .map((d) => d.value);

  // подсчет среднего арифметического
  const sum = filteredValues.reduce((acc, currentValue) => acc + currentValue,0);
  const average = sum / filteredValues.length;

  // функция для определения иконки в зависимости от валюты
  const getIcon = (currency: string) => {
    switch (currency) {
      case 'Курс доллара':
        return '$';
      case 'Курс евро':
        return '€';
      case 'Курс юаня':
        return '¥';
      default:
        return null;
    }
  };

  // функция для получения опции графика для выбранной валюты
  const getOptions = () => {
    const filteredData = data.filter((d) => d.indicator === valueChoice);
    const options = {
      title: {
        text: `${valueChoice},  ${getIcon(valueChoice)}/₽`,
        textStyle: {
          color: '#002033',
          fontSize: 20,
          fontWeight: 'bold',
        },
      },

      grid: { top: 70, right: 8, bottom: 24, left: 36 },
      xAxis: {
        type: 'category',
        data: filteredData.map((d) => d.month),
      },
      yAxis: {
        type: 'value',
        min: Math.min(...filteredData.map((d) => d.value)),
        max: Math.max(...filteredData.map((d) => d.value)),
      },
      series: [
        {
          data: filteredData.map((d) => d.value),
          type: 'line',
          smooth: true,
          name: valueChoice,
          lineStyle: {
            width: 3,
            color: '#F38B00',
          },
          itemStyle: {
            color: '#F38B00',
          },
          tooltip: {
            valueFormatter: (value: number) => value + ' ₽',
          },
        },
      ],
      tooltip: {
        trigger: 'axis',
      },
    };
    return <ReactECharts option={options} />;
  };

  React.useEffect(() => {
    getData();
  }, []);

  return (
    <>
      {loading ? (
        <Loading type="spinningBubbles" color="#F38B00" />
      ) : (
      <Theme preset={presetGpnDefault}>
        <div className="app">
          <ChoiceGroup
            className="choice-group"
            value={valueChoice}
            onChange={(value) => setValueChoice(value)}
            items={currencies}
            getItemLabel={(item: string) => `${getIcon(item)}`}
            multiple={false}
            name="ChoiceGroup"
          />
          <div className="app-wrapper">
            {getOptions()}
            <div className="statistics">
              <div className="statistics-text">Среднее за период</div>
              <div className="statistics-value">{average} <span>₽</span></div>
            </div>
          </div>
        </div>
      </Theme>
      )}
    </>
  );
}

export default App;
