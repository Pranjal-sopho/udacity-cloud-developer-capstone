import dateFormat from 'dateformat'
import { History } from 'history'
import update from 'immutability-helper'
import * as React from 'react'
import {
  Button,
  Checkbox,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Image,
  Loader
} from 'semantic-ui-react'

import { createFolio, deleteFolio, getFolios} from '../api/folio-api'
import Auth from '../auth/Auth'
import { Folio } from '../types/Folio'

interface FoliosProps {
  auth: Auth
  history: History
}

interface FoliosState {
  Folios: Folio[]
  newFolioName: string
  buyDate: string
  volume: number
  price: number
  loadingFolios: boolean
}

export class Folios extends React.PureComponent<FoliosProps, FoliosState> {
  state: FoliosState = {
    Folios: [],
    newFolioName: '',
    buyDate: '01/01/2020',
    volume:1,
    price:1,
    loadingFolios: true
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newFolioName: event.target.value })
    console.log(event.target.value)
  }

  handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ volume: parseInt(event.target.value) as number })
    console.log(event.target.value)
  }

  handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ price: parseInt(event.target.value) as number})
    console.log(event.target.value)
  }

  handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ buyDate: event.target.value })
    console.log(event.target.value)
  }

  onEditButtonClick = (FolioId: string) => {
    this.props.history.push(`/Folios/${FolioId}/edit`)
  }

  onFolioCreate = async (event: React.ChangeEvent<HTMLButtonElement>) => {
    try {
      //const dueDate = this.calculateDueDate()
      const newFolio = await createFolio(this.props.auth.getIdToken(), {
        name: this.state.newFolioName,
        buyDate: this.state.buyDate,
        volume: this.state.volume,
        price: this.state.price
      })
      console.log("new Folio:",newFolio)
      this.setState({
        Folios: [...this.state.Folios, newFolio],
        newFolioName: ''
      })
      console.log("updated state after adding new Folio:", this.state.Folios)
      alert('Folio creation success!')
    } catch {
      alert('Folio creation failed')
    }
  }

  onFolioDelete = async (FolioId: string) => {
    try {
      await deleteFolio(this.props.auth.getIdToken(), FolioId)
      this.setState({
        Folios: this.state.Folios.filter(Folio => Folio.folioId != FolioId)
      })
    } catch {
      alert('Folio deletion failed')
    }
  }
/*
  onFolioCheck = async (pos: number) => {
    try {
      const Folio = this.state.Folios[pos]
      await patchFolio(this.props.auth.getIdToken(), Folio.FolioId, {
        name: Folio.name,
        dueDate: Folio.dueDate,
        done: !Folio.done
      })
      this.setState({
        Folios: update(this.state.Folios, {
          [pos]: { done: { $set: !Folio.done } }
        })
      })
    } catch {
      alert('Folio deletion failed')
    }
  }
*/
  async componentDidMount() {
    try {
      const Folios = await getFolios(this.props.auth.getIdToken())
      this.setState({
        Folios,
        loadingFolios: false
      })
    } catch (e) {
      alert(`Failed to fetch Folios: ${e.message}`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">Folios</Header>

        {this.renderCreateFolioInput()}

        {this.renderFolios()}
      </div>
    )
  }

  renderCreateFolioInput() {
    return (
      <Grid.Row>
        <Grid.Column width={5}>
          <Input
            action={{
              color: 'teal',
              labelPosition: 'left',
              icon: 'add',
              content: 'New task',
              onClick: this.onFolioCreate
            }}
            fluid
            actionPosition="left"
            placeholder="Share code (name)"
            onChange={this.handleNameChange}
          />
        </Grid.Column>
        <Grid.Column width={5}>
          <Input
            fluid
            actionPosition="left"
            placeholder="volume"
            onChange={this.handleVolumeChange}
          />
        </Grid.Column>
        <Grid.Column width={5}>
          <Input
            fluid
            actionPosition="left"
            placeholder="price"
            onChange={this.handlePriceChange}
          />
        </Grid.Column>
        <Grid.Column width={5}>
          <Input
            fluid
            actionPosition="left"
            placeholder="buy Date"
            onChange={this.handleDateChange}
          />
        </Grid.Column>
        <Grid.Column width={5}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
    )
  }

  renderFolios() {
    if (this.state.loadingFolios) {
      return this.renderLoading()
    }

    return this.renderFoliosList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading Folios
        </Loader>
      </Grid.Row>
    )
  }

  renderFoliosList() {
    return (
      <Grid padded>
        {this.state.Folios.map((Folio, pos) => {
          return (
            <Grid.Row >
              <Grid.Column width={1} verticalAlign="middle">
                
              </Grid.Column>
              <Grid.Column width={10} verticalAlign="middle">
                {Folio.name}
              </Grid.Column>
              <Grid.Column width={3} verticalAlign="middle">
                {Folio.volume}
              </Grid.Column>
              <Grid.Column width={3} verticalAlign="middle">
                {Folio.price}
              </Grid.Column>
              <Grid.Column width={3} floated="right">
                {Folio.buyDate}
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="red"
                  onClick={() => this.onFolioDelete(Folio.folioId)}
                >
                  <Icon name="delete" />
                </Button>
              </Grid.Column>
              
              <Grid.Column width={16}>
                <Divider />
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </Grid>
    )
  }

}
