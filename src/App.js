import React, { Component } from 'react'

import './App.css'
import './css/main.css'
import './css/form.css'
import main from './main'

import logo from './img/seja-ninja.svg'

const areas = [
    'Fotografia',
    'Disenho',
    'Redes',
    'Journalismo',
    'Hackeragem'
]

class Selector extends React.PureComponent {
    constructor () {
        super ()
        this.state = {
            open: false
        }
    }

    render () {
        const {options} = this.props
        const {open, selected = 0} = this.state
        const extraClass = open ? 'nl-field-open' : null
        const toggleOpen = () => this.setState({open: !!!open})

        return (
            <div className={`nl-field nl-dd ${extraClass}`}>
	            <a className="nl-field-toggle" 
                   onClick={toggleOpen}>
                    {options[selected]}</a>
	            <ul>
                    {options.map((entry, i) => 
                        <li className={i === selected ? 'nl-dd-checked' : null} 
                            key={entry}
                            onClick={() => {
                                    this.setState ({selected: i})
                                    toggleOpen()
                            }}
                            >
                            {entry}
                        </li>
                    )}
	            </ul>
            </div>
            
        )
    }
}


class Input extends React.PureComponent {
    constructor (props) {
        super (props)
        this.state = {
            open: false,
            value: props.value 
        }
    }

    render () {
        const {subline, placeholder, type, ...props} = this.props
        const {open, value, error} = this.state
        const extraClass = open ? 'nl-field-open' : null
        const toggleOpen = () => this.setState({open: !!!open})

        let input
        const submit = e => {
            e.preventDefault()
            e.stopPropagation()
            if (input.checkValidity()) {
                this.setState({value: input.value, open: false, error: false})
            } else {
                this.setState({error: input.validationMessage})
            }
        }
        return (
            <div className={`nl-field nl-ti-text ${extraClass}`}>
                {open ? (
                     <ul>
		                 <li className="nl-ti-input">
			                 <input type={type} ref={ref => input = ref} defaultValue={value} placeholder={placeholder} />
			                 <button className="nl-field-go" onClick={submit}>Go</button>
		                 </li>
                         {error && <li className="nl-ti-validation">{error}</li>}
		                 {subline && <li className="nl-ti-example">{subline}</li>}
	                 </ul>
                ):(
                     <a className="nl-field-toggle" onClick={toggleOpen}>
                         { value || placeholder }
                     </a>)
                }
            </div>
        )

    }
}

Input.defaultProps = {
    type: "text"
}

const Submit = ({children}) => (
	<button className="nl-submit" type="submit">{children}</button>
)

const Intro = ({next}) => (
    <div className="nl-phase nl-phase-0 nl-form">
        <h1>É muito bom ter você com a gente</h1>
        <h2>Preencna seus dados praa que possamos te conhecer melhor e entrar em contato</h2>
        
        <button className="nl-submit" onClick={next}>Próximo</button>
    </div>
)

const Form = ({children, onSubmit}) => (
    <form id="nl-form" className="nl-form" onSubmit={e => {
            e.preventDefault()
            e.stopPropagation()
            onSubmit()
    }}>
        {children}
	    <div className="nl-overlay"></div>
    </form>
)

const Register = ({next}) => (
    <Form onSubmit={next}>
        <div>
            Meu nome é <Input placeholder="Diego Maradona" subline="Como te chaman en el bairro ?"/>,
    sou de <Input placeholder="São Paulo/RJ" subline="so tipar e completamos"/> e quero colaborar na parte do
    <Selector options={areas}/>. Para entrar em contato comigo basta mandar um e-mail para
    <Input type="email" placeholder="diego@afa.org.ar" subline="Prometemos no mandar spam"/> ou ligar para 
    <Input type="tel" placeholder="+552983402989" subline="No mandamos nudes sin que nos pidan"/>
    
        </div>
        <Submit>Pronto !</Submit>
    </Form>
)

const Thanks = () => (
    <div className="nl-phase nl-phase-2 nl-form">
        <button className="nl-submit">Tamos Juntos !</button>
    </div>
)


class Stepper extends React.PureComponent {
    constructor () {
        super()
        this.state = {
            step: 0
        }
    }

    render () {
        const {children} = this.props
        const {step} = this.state

        const clonedChild = React.Children.map(
            children, (child, i) => i === step ? React.cloneElement(child, {
                next: () => (this.setState({step: step + 1}))
            }): null).filter(a => a)
        
        return (
            <div>
                {clonedChild}
            </div>
        )
    }
}

const Details = () => (
    <div className="flex">
        <h1>Preencha seus dados praa que possamos te conhecer
            melhor e entrar em contato</h1>
        <Register/>
    </div>
)

class App extends Component {
    render () {
        return (

            <div className='App'>
                <div id="hero">
                    <img src={logo}/>
                    <Details/>
                </div>

            </div>)
    }
}

export default App
