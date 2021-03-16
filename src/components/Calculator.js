import React, {useState} from 'react'

import NumberInput from './NumberInput.js'

const initialMonthlyIncome = 35000
const initialPfr = 22
const initialFss = 2.9
const initialFoms = 5.1

const calculateContractMoney = (income) => {
  if (income > 4350000) {
    const extraIncome = income - 4350000
    return 5000000 + Math.round(extraIncome / 0.85)
  } else {
    return Math.round(income / 0.87)
  }
}

const pfrAfterDelimiter = 10
const pfrDelimiter = 1292000

const calculatePfr = (income, pfr) => {
  if (income > pfrDelimiter) {
    return Math.round((income - pfrDelimiter) * pfrAfterDelimiter / 100) + Math.round(pfrDelimiter * pfr / 100)
  } else {
    return Math.round(income * pfr / 100)
  }
}

const calculateFss = (income, fss) => {
  const taxableMaximum = Math.min(912000, income)
  return Math.round(taxableMaximum * fss / 100)
}

const calculateFoms = (income, foms) => {
  return Math.round(income * foms / 100)
}

const formatMoney = (value) => value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")

const Row = ({children, hidden}) => {
  return (
    <React.Fragment>
      <div className={classNames({'text-right': true, hidden: hidden})}>
        {children[0]}
      </div>
      <div className={classNames({'text-left': true, hidden: hidden})}>
        {children[1]}
      </div>
    </React.Fragment>
  )
}

const Container = ({children, hidden}) => {
  let classes = 'border-t w-auto max-w-3xl mx-auto p-4 rounded-none mt-0 pb-6'
  if (hidden) {classes += ' hidden'}

  return (
    <div className={classes}>
      {children}
    </div>
  )
}

const Grid2Cols = ({children}) => {
  return (
    <Container>
      <div className='grid grid-cols-2 gap-4'>
        {children}
      </div>
    </Container>
  )
}

const Label = ({title, id, children}) => {
  if (title !== undefined) {
    return <label htmlFor={id} className='border-dashed border-b-2' title={title}>{children}</label>
  } else {
    return <label htmlFor={id}>{children}</label>
  }
}

const LabelSpan = ({title, children}) => {
  if (title !== undefined) {
    return <span className='border-dashed border-b-2 cursor-default' title={title}>{children}</span>
  } else {
    return <span>{children}</span>
  }
}

const classNames = (classes) => {
  return Object.entries(classes)
    .filter(([key, value]) => value)
    .map(([key, value]) => key)
    .join(' ');
}

const DetailsButton = ({onClick, hidden}) => {
  if (hidden) {
    return ''
  } else {
    return (
      <div className={hidden ? 'hidden' : ''}>
        <button className='rounded bg-green-300 hover:bg-green-400 hover:p-4 shadow p-2 mt-4' onClick={onClick}>Подробнее</button>
      </div>
    )
  }
}

export default function Calculator() {
  const [monthlyIncome, setMonthlyIncome] = useState(initialMonthlyIncome)
  const [pfr, setPfr] = useState(initialPfr)
  const [fss, setFss] = useState(initialFss)
  const [foms, setFoms] = useState(initialFoms)

  const [detailsHidden, setDetailsHidden] = useState(true)

  const income = monthlyIncome * 12

  const contractMoney = calculateContractMoney(income)
  const pfrMoney = calculatePfr(contractMoney, pfr)
  const fssMoney = calculateFss(contractMoney, fss)
  const fomsMoney = calculateFoms(contractMoney, foms)

  const ndflMoney = contractMoney - income
  const taxMoney = pfrMoney + fssMoney + fomsMoney + ndflMoney
  const taxPercent = Math.round(taxMoney / income * 100, 2)

  const onShowDetails = () => {
    setDetailsHidden(false)

    window.gtag('event', 'details', {method: 'show', income: monthlyIncome});
  }

  return (
    <React.Fragment>
      <Grid2Cols>
        <Row>
          <Label id='incomeInput'>{detailsHidden ? 'Получаю в месяц' : 'Зарплата на руки'}:</Label>
          <div>
            <NumberInput id='incomeInput' initialValue={initialMonthlyIncome} placeholder={initialMonthlyIncome} onChange={setMonthlyIncome} />&nbsp;₽
            <br className={detailsHidden ? 'hidden' : ''}/>
            <span className={classNames({'text-sm': true, hidden: detailsHidden})}>или {formatMoney(Math.round(income))}&nbsp;₽ в&nbsp;год</span>
          </div>
        </Row>

        <Row hidden={detailsHidden}>
          <Label id='pfrInput' title='Пенсионный фонд РФ'>ПФР:</Label>
          <div>
            <NumberInput id='pfrInput' initialValue={initialPfr} placeholder={initialPfr} onChange={setPfr} />&nbsp;%
          </div>
        </Row>

        <Row hidden={detailsHidden}>
          <Label id='fssInput' title='Фонд социального страхования'>ФСС:</Label>
          <div>
            <NumberInput id='fssInput' initialValue={initialFss} placeholder={initialFss} onChange={setFss} />&nbsp;%
          </div>
        </Row>

        <Row hidden={detailsHidden}>
          <Label id='fomsInput' title='Фонд обязательного медицинского страхования'>ФОМС:</Label>
          <div>
            <NumberInput id='fomsInput' initialValue={initialFoms} placeholder={initialFoms} onChange={setFoms} />&nbsp;%
          </div>
        </Row>
      </Grid2Cols>

      <Grid2Cols>
        <Row hidden={detailsHidden}>
          <LabelSpan title='Налогооблагаемая база'>Зарплата по договору:</LabelSpan>
          <div>
            {formatMoney(Math.round(contractMoney / 12))}&nbsp;₽
            <br/>
            <span className='text-sm'>или {formatMoney(contractMoney)}&nbsp;₽ в&nbsp;год</span>
          </div>
        </Row>

        <Row hidden={detailsHidden}>
          <LabelSpan title='Налог на доходы физических лиц (13% до 5000000 в год)'>НДФЛ:</LabelSpan>
          <div>
            {formatMoney(Math.round(ndflMoney / 12))}&nbsp;₽
            <br/>
            <span className='text-sm'>или {formatMoney(ndflMoney)}&nbsp;₽ в&nbsp;год</span>
          </div>
        </Row>

        <Row hidden={detailsHidden}>
          <LabelSpan title='Пенсионный фонд РФ'>ПФР:</LabelSpan>
          <div>
            {formatMoney(Math.round(pfrMoney / 12))}&nbsp;₽
            <br/>
            <span className='text-sm'>или {formatMoney(pfrMoney)}&nbsp;₽ в&nbsp;год</span>
          </div>
        </Row>

        <Row hidden={detailsHidden}>
          <LabelSpan title='Фонд социального страхования'>ФСС:</LabelSpan>
          <div>
            {formatMoney(Math.round(fssMoney / 12))}&nbsp;₽
            <br/>
            <span className='text-sm'>или {formatMoney(fssMoney)}&nbsp;₽ в&nbsp;год</span>
          </div>
        </Row>

        <Row hidden={detailsHidden}>
          <LabelSpan title='Фонд обязательного медицинского страхования'>ФОМС:</LabelSpan>
          <div>
            {formatMoney(Math.round(fomsMoney / 12))}&nbsp;₽
            <br/>
            <span className='text-sm'>или {formatMoney(fomsMoney)}&nbsp;₽ в&nbsp;год</span>
          </div>
        </Row>

        <Row>
          <span className='cursor-default font-semibold'>{detailsHidden ? 'Плачу налогов' : 'Итого налогов'}:</span>
          {detailsHidden ?
            <div className='font-semibold'>
              {formatMoney(Math.round(taxMoney / 12))}&nbsp;₽
            </div> :
            <div className='font-semibold'>
              {formatMoney(Math.round(taxMoney / 12))}&nbsp;₽
              <br/>
              <span className='text-sm'>или {formatMoney(taxMoney)}&nbsp;₽ в&nbsp;год</span>
              <br/>
              <span className='text-sm'>или <span className='font-semibold'>{Math.round(taxPercent)}% от полученных на руки денег</span></span>
            </div>
          }
        </Row>
      </Grid2Cols>

      <DetailsButton hidden={!detailsHidden} onClick={onShowDetails} />

      <Container hidden={detailsHidden}>
        <p className='text-center text-lg pb-2'>
          <a target='_blank' rel='noreferrer' href='https://www.glavbukh.ru/art/99085-otchisleniya-v-fondy-s-zarplati-2020'>
            Методика расчета
          </a>
        </p>
        <table className='table-auto mx-auto text-left'>
          <thead>
            <tr>
              <th className='border-2 p-2'>Фонд</th>
              <th className='border-2 p-2'>Предельная величина</th>
              <th className='border-2 p-2'>Тариф</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td rowSpan='2' className='align-middle border-2 p-2'>ПФР</td>
              <td className='border-2 p-2'>До предельной базы 1 292 000 руб.</td>
              <td className='border-2 p-2'>22%</td>
            </tr>
            <tr>
              <td className='border-2 p-2'>Свыше предельной базы 1 292 000 руб.</td>
              <td className='border-2 p-2'>10%</td>
            </tr>

            <tr>
              <td rowSpan='2' className='align-middle border-2 p-2'>ФСС</td>
              <td className='border-2 p-2'>До предельной базы 912 000 руб.</td>
              <td className='border-2 p-2'>2.9%</td>
            </tr>
            <tr>
              <td className='border-2 p-2'>Свыше предельной базы 912 000 руб.</td>
              <td className='border-2 p-2'>0</td>
            </tr>

            <tr>
              <td className='align-middle border-2 p-2'>ФОМС</td>
              <td className='border-2 p-2'>Предельная база не применяется.</td>
              <td className='border-2 p-2'>5.1%</td>
            </tr>
          </tbody>
        </table>
        <p className='p-2 text-left'>
          <a target='_blank' rel='noreferrer' className='underline' href='https://www.google.com/search?q=%D0%BD%D0%B4%D1%84%D0%BB+15+%D0%BF%D1%80%D0%BE%D1%86%D0%B5%D0%BD%D1%82%D0%BE%D0%B2'>
          Повышенный до 15% НДФЛ</a> коснется только заработка, превышающего 5 миллионов рублей в год.
          А вот <a target='_blank' className='underline' rel='noreferrer' href='https://www.google.com/search?q=%D0%BD%D0%B4%D1%81+20+%D0%BF%D1%80%D0%BE%D1%86%D0%B5%D0%BD%D1%82%D0%BE%D0%B2'>
          повышенный до 20% НДС</a> коснется всех. Но НДС мы считать не будем, чтобы не стало совсем грустно.
        </p>
        <p>
          Ознакомьтесь <a className='underline font-semibold' target='_blank' rel='noreferrer' href='https://www.pwc.com/gx/en/services/tax/publications/paying-taxes-2020/overall-ranking-and-data-tables.html'>
          с&nbsp;отчетом&nbsp;PricewaterhouseCoopers</a> о&nbsp;суммарных налогах в разных странах.
        </p>
      </Container>
    </React.Fragment>
  )
}
