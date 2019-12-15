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

import { createPhotodescription, deletePhotodescription, getPhotodescriptions, patchPhotodescription } from '../api/photos-api'
import Auth from '../auth/Auth'
import { Photo } from '../types/Photo'

interface PhotosProps {
  auth: Auth
  history: History
}

interface PhotosState {
  photos: Photo[]
  newPhotoName: string
  loadingPhotos: boolean
}

export class Photos extends React.PureComponent<PhotosProps, PhotosState> {
  state: PhotosState = {
    photos: [],
    newPhotoName: '',
    loadingPhotos: true
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newPhotoName: event.target.value })
  }

  onEditButtonClick = (photoId: string) => {
    this.props.history.push(`/photos/${photoId}/edit`)
  }

  onPhotodescriptionCreate = async (event: React.ChangeEvent<HTMLButtonElement>) => {
    try {
      const dueDate = this.calculateDueDate()
      const newPhoto = await createPhotodescription(this.props.auth.getIdToken(), {
        name: this.state.newPhotoName,
        dueDate
      })
      this.setState({
        photos: [...this.state.photos, newPhoto],
        newPhotoName: ''
      })
    } catch {
      alert('Photos creation failed')
    }
  }

  onPhotodescriptionDelete = async (photoId: string) => {
    try {
      await deletePhotodescription(this.props.auth.getIdToken(), photoId)
      this.setState({
        photos: this.state.photos.filter(photos => photos.photoId != photoId)
      })
    } catch {
      alert('Photo deletion failed')
    }
  }

  onPhotoCheck = async (pos: number) => {
    try {
      const photos = this.state.photos[pos]
      await patchPhotodescription(this.props.auth.getIdToken(), photos.photoId, {
        name: photos.name,
        dueDate: photos.dueDate,
        done: !photos.done
      })
      this.setState({
        photos: update(this.state.photos, {
          [pos]: { done: { $set: !photos.done } }
        })
      })
    } catch {
      alert('Photo deletion failed')
    }
  }

  async componentDidMount() {
    try {
      const photos = await getPhotodescriptions(this.props.auth.getIdToken())
      this.setState({
        photos,
        loadingPhotos: false
      })
    } catch (e) {
      alert(`Failed to fetch photo description: ${e.message}`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">Photos App</Header>

        {this.renderCreatePhotodescriptionInput()}

        {this.renderPhotos()}
      </div>
    )
  }
  

  renderCreatePhotodescriptionInput() {
    return (
      <Grid.Row>
        <Grid.Column width={16}>
          <Input
            action={{
              color: 'teal',
              labelPosition: 'left',
              icon: 'add',
              content: 'New Photo',
              onClick: this.onPhotodescriptionCreate
            }}
            fluid
            actionPosition="left"
            placeholder="Describe your Photos which changed your world..."
            onChange={this.handleNameChange}
          />
          
        </Grid.Column>
        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
    )
  }

  renderPhotos() {
    if (this.state.loadingPhotos) {
      return this.renderLoading()
    }

    return this.renderPhotosList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading Photos
        </Loader>
      </Grid.Row>
    )
  }

  renderPhotosList() {
    return (
      <Grid padded>
        {this.state.photos.map((photos, pos) => {
          return (
            <Grid.Row key={photos.photoId}>
              <Grid.Column width={1} verticalAlign="middle">
                <Checkbox
                  onChange={() => this.onPhotoCheck(pos)}
                  checked={photos.done}
                />
              </Grid.Column>
              <Grid.Column width={10} verticalAlign="middle">
                {photos.name}
              </Grid.Column>
              <Grid.Column width={3} floated="right">
                {photos.dueDate}
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="blue"
                  onClick={() => this.onEditButtonClick(photos.photoId)}
                >
                  <Icon name="pencil" />
                </Button>
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="red"
                  onClick={() => this.onPhotodescriptionDelete(photos.photoId)}
                >
                  <Icon name="delete" />
                </Button>
              </Grid.Column>
              {photos.uploadUrl && (
                <Image src={photos.uploadUrl} size="small" wrapped />
              )}
              <Grid.Column width={16}>
                <Divider />
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </Grid>
    )
  }

  calculateDueDate(): string {
    const date = new Date()
    date.setDate(date.getDate() + 7)

    return dateFormat(date, 'yyyy-mm-dd') as string
  }
}
