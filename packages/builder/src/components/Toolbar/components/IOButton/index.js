import React from 'react'
import PropTypes from 'prop-types'

import Dropdown from '../../../Dropdown'
import { Button, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap'

import Uploader from '../../../Uploader'
import Icon from '../../../Icon'

import { fromJSON } from '../../../../logic/io/load'
import { stateToDownload } from '../../../../logic/io/save'
import downloadStaticLocal from '../../../../logic/io/export/modifiers/local'
import downloadStaticExpFactory from '../../../../logic/io/export/modifiers/expfactory'

const IOButton = (_, context) => {
  let dropdown = null

  return <Dropdown
    type='button'
    ref={ c => (dropdown = c) }
  >
    <Button id="caret" outline color="secondary"
      onClick={ () => stateToDownload(context.store.getState()) }
    >
      <Icon icon="save" weight="l" fallbackWeight="r" />
    </Button>
    <DropdownToggle
      caret split
      outline color="secondary"
    />
    <DropdownMenu>
      <DropdownItem header>Study</DropdownItem>
      <DropdownItem
        onClick={() => {
          if (window.confirm('Are you sure you want to reset the study?')) {
            context.store.dispatch({ type: 'RESET_STATE' })
          }
        }}
      >
        New
      </DropdownItem>
      <Uploader
        accept='application/json'
        maxSize={ 20 * 1024 ** 2 } // 20 MiB
        onUpload={
          // TODO: This smells like it should
          //   be extracted and abstracted
          fileContents => {
            try {
              // Parse file from JSON
              const state = fromJSON(fileContents)
              // Hydrate store from resulting object
              context.store.dispatch({
                type: 'HYDRATE', state,
              })
            } catch(e) {
              // If things don't work out, let the user know
              alert('Couldn\'t load file, found error', e)
            } finally {
              dropdown.toggle()
            }
          }
        }
        className="dropdown-item"
      >
        Open
      </Uploader>
      <DropdownItem
        onClick={
          () => stateToDownload(context.store.getState())
        }
      >
        Save
      </DropdownItem>
      <DropdownItem divider/>
      <DropdownItem header>Export as bundle</DropdownItem>
      <DropdownItem
        onClick={ () => downloadStaticLocal(context.store.getState()) }
      >
        Plain <span className='text-muted'>(no backend)</span>
      </DropdownItem>
      <DropdownItem
        onClick={
          () => context.store.dispatch({
            type: 'SHOW_MODAL',
            modalType: 'EXPORT_PHP',
            modalProps: {},
          })
        }
      >
        PHP backend
      </DropdownItem>
      <DropdownItem divider/>
      <DropdownItem header>Export as integration</DropdownItem>
      <DropdownItem
        onClick={ () => downloadStaticExpFactory(context.store.getState()) }
      >
        The Experiment Factory <span className='text-muted'>(v3)</span>
      </DropdownItem>
      <DropdownItem
        onClick={
          () => context.store.dispatch({
            type: 'SHOW_MODAL',
            modalType: 'EXPORT_PM',
            modalProps: {},
          })
        }
      >
        Generic survey software
      </DropdownItem>
    </DropdownMenu>
  </Dropdown>
}

IOButton.contextTypes = {
  store: PropTypes.object
}

export default IOButton
