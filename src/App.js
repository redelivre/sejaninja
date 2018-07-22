import React, { Component } from 'react'

import {EurekaForm} from 'react-eureka'

import './App.css'
import './css/main.css'
import './css/form.css'
import main from './main'

import logo from './img/seja-ninja.svg'

const questions = [
  {key: 'name', title: 'Como você se chama? '},
  //  {key: 'email', title: 'Qual seu email?'},
  {key: 'tel', title: 'Qual seu telefone? '},
  {key: 'city', title: 'Qual cidade, estado, país você mora?'},
  {key: 'activity', title: 'O que você faz da vida?'},
  {key: 'motivation', title: 'Pq vc quer ser NINJA?'},
  {key: 'skills', title: 'Com o que você colaboraria?'},
  {key: 'instagram', title: 'Compartilhe seu instagram'}
]

class Stepper extends React.PureComponent {
  constructor () {
    super()
    this.state = {
      step: 0
    }
  }

  render () {
    const {children} = this.props
    const {step, args} = this.state

    const clonedChild = React.Children.map(
      children, (child, i) => i === step ? React.cloneElement(child, {
        args,
        next: (...args) => (this.setState({step: step + 1, args: args}))
      }) : null).filter(a => a)

    return (
      <div>
        {clonedChild}
      </div>
    )
  }
}

const FormWrapper = ({next, ...props}) => (
  <EurekaForm id='contact' questions={questions} autoFocus
    onSubmit={next}
  />
)

const formMapping = {
  name: 'entry.276763906',
  email: 'entry.2062246402',
  tel: 'entry.1698681350',
  city: 'entry.884182261',
  activity: 'entry.1340129654',
  motivation: 'entry.322372410',
  skills: 'entry.919281481',
  instagram: 'entry.1348441891'
}

const SendData = ({next, args}) => {
  const [element, results] = args
  const { name, city, area, email, phone } = results
  const params = Object.keys(results)
    .map(key => `${formMapping[key]}=${results[key]}`)
    .join('&')

  const url = `https://docs.google.com/forms/d/14F27ai-E3gaBKR3ca2KFcLiU-wrBEE8wDrsAoNa328o/viewform?${params}`
  return (
    <h1>VALEU <em>{name}</em> de <em>{city}</em>, favor de
      <button className='pink' onClick={() => window.open(url)}>
          Confirmar
    </button>
    </h1>
  )
}

const Details = () => (
  <div className='flex'>
    <h1>Preencha seus dados para que possamos te conhecer
        melhor e entrar em contato :)</h1>
    <Stepper>
      <FormWrapper />
      <SendData />
    </Stepper>
  </div>
)

class App extends Component {
  render () {
    return (

      <div className='App'>
        <div id='hero'>
          <img src={logo} />
          <Details />
        </div>

      </div>)
  }
}

export default App
