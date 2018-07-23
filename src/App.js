import React, { Component } from 'react'

import {EurekaForm} from 'react-eureka'

import './App.css'
import './css/main.css'
import './css/form.css'
import main from './main'

import logo from './img/seja-ninja.svg'

const Pink = ({children}) => (
    <em className="pink">{children}</em>
)

const questions = [
    {key: 'name', title: <span>Como você se <Pink>chama</Pink>?</span>},
    //  {key: 'email', title: 'Qual seu email?'},
    {key: 'tel', title: <span>Qual seu <Pink>fone</Pink>?</span>},
    {key: 'city', title: <span>Qual <Pink>cidade</Pink>, <Pink>estado</Pink>, <Pink>país</Pink> você mora?</span>},
    {key: 'activity', title: <span>O que você <Pink>faz da vida</Pink>?</span>},
    {key: 'motivation', title: <span>Pq vc quer <Pink>ser NINJA</Pink>?</span>},
    {key: 'skills', title: <span>Com o <Pink>que</Pink> você colaboraria?</span>},
    {key: 'instagram', title: <span>Compartilhe seu <Pink>instagram</Pink></span>}
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
    <div className='flex'>
    <h1 className="caps">Preencha seus dados para que possamos te conhecer
            melhor e entrar em contato :)</h1>
        <EurekaForm id='contact' questions={questions} autoFocus
                    onSubmit={next}
        />
      </div>
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

    console.error ('RESULTS', args)
  const url = `https://docs.google.com/forms/d/14F27ai-E3gaBKR3ca2KFcLiU-wrBEE8wDrsAoNa328o/viewform?${params}`
  return (
      <div className='flex'>
          <h1>Valeu <Pink>{name}</Pink> de <Pink>{city}</Pink>!
              <button className='pink' onClick={() => window.open(url)}>
                  Confirme aqui seu cadastro
              </button>
          </h1>
      </div>
  )
}

const Details = () => (
    <Stepper>
        <FormWrapper />
        <SendData />
    </Stepper>
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
