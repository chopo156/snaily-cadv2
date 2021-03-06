import React, { Component } from 'react';
import Axios from 'axios';
import { backendURL } from '../../../../config/config';
import Cookies from 'js-cookie';
import ErrorMessage from '../../../Partials/Messages/ErrorMessage';
import LoadingArea from '../../../Partials/LoadingArea';
import SuccessMessage from '../../../Partials/Messages/SuccessMessage';
import DeleteCitizenModal from './DeleteCitizenModal';

export default class CitizenManagement extends Component {
  constructor() {
    super();

    this.state = {
      loading: true,
      searchValue: '',
      citizens: [],
      filteredCitizens: [],
      message: sessionStorage.getItem('admin-message'),
    };
  }

  getCitizens = () => {
    Axios({
      url: backendURL + '/admin/citizens',
      method: 'GET',
      headers: {
        'x-auth-snailycad-token': Cookies.get('__session'),
      },
    })
      .then((res) => {
        if (res.data.citizens) {
          this.setState({
            citizens: res.data.citizens,
            filteredCitizens: res.data.citizens,
            loading: false,
          });
        }
      })
      .catch((err) => console.log(err));
  };

  handleSearch = (e) => {
    // Thanks to: https://codepen.io/iamtimsmith/pen/zJPzwN?editors=1010
    let currentList = [];
    let newList = [];

    if (e.target.value === '') {
      newList = this.state.citizens;
    } else {
      currentList = this.state.citizens;

      newList = currentList.filter((item) => {
        const lc = item.full_name.toLowerCase();
        const filter = e.target.value.toLowerCase();
        return lc.includes(filter);
      });
    }

    this.setState({
      filteredCitizens: newList,
    });
  };

  componentDidMount() {
    document.title = 'Citizen Management - Admin';
    this.getCitizens();
  }

  componentDidUpdate() {
    document.addEventListener(
      'beforeunload',
      sessionStorage.removeItem('admin-message')
    );
  }

  render() {
    const { filteredCitizens, citizens, loading, message } = this.state;
    if (loading) {
      return <LoadingArea />;
    }
    return (
      <div className='container col text-light'>
        {message ? <SuccessMessage message={message} dismiss /> : null}
        <div className='form-group'>
          <label htmlFor='search'>Filter by citizen name</label>
          <input
            className='form-control bg-dark border-secondary text-light'
            type='search'
            name='search'
            id='search'
            onChange={this.handleSearch}
          />
        </div>

        <ul className='list-group'>
          {!citizens[0] ? (
            <ErrorMessage message='This CAD does not have any citizens' />
          ) : null}
          {!filteredCitizens[0] ? (
            <ErrorMessage message='No citizens found with that name' />
          ) : (
            filteredCitizens.map((citizen, index) => {
              return (
                <li
                  key={index}
                  className='list-group-item bg-dark border-secondary d-flex justify-content-between'>
                  <div>
                    <h5 className='font-weight-bold'>
                      {++index} | {citizen.full_name}
                    </h5>
                    <span className='font-weight-bold'>Linked To: </span>
                    {citizen.linked_to}
                    <div className='collapse' id={'citizenInfo' + citizen.id}>
                      <span className='font-weight-bold'>Full Name:</span>{' '}
                      {citizen.full_name} <br />
                      <span className='font-weight-bold'>
                        Date of Birth:
                      </span>{' '}
                      {citizen.birth} <br />
                      <span className='font-weight-bold'>Gender:</span>{' '}
                      {citizen.gender} <br />
                      <span className='font-weight-bold'>Ethnicity:</span>{' '}
                      {citizen.ethnicity} <br />
                      <span className='font-weight-bold'>Hair Color:</span>{' '}
                      {citizen.hair_color} <br />
                      <span className='font-weight-bold'>Eye Color:</span>{' '}
                      {citizen.eye_color} <br />
                      <span className='font-weight-bold'>Address:</span>{' '}
                      {citizen.address} <br />
                      <span className='font-weight-bold'>Height:</span>{' '}
                      {citizen.height} <br />
                      <span className='font-weight-bold'>Weight:</span>{' '}
                      {citizen.weight} <br />
                      <span className='font-weight-bold'>Employer:</span>{' '}
                      {citizen.business} <br />
                      <div className='d-flex mt-2'>
                        <a
                          href={'/admin/manage/citizens/edit/' + citizen.id}
                          className='btn btn-primary mr-2'>
                          Edit Citizen Info
                        </a>
                        <button
                          type='button'
                          className='btn btn-danger'
                          data-toggle='modal'
                          data-target={'#deleteCitizen'+citizen.id}>
                          Delete Citizen
                        </button>
                      </div>
                    </div>
                  </div>
                  <div>
                    <button
                      className='btn btn-primary'
                      type='button'
                      data-toggle='collapse'
                      data-target={'#citizenInfo' + citizen.id}
                      aria-expanded='false'
                      aria-controls={'citizenInfo' + citizen.id}>
                      Toggle Info
                    </button>
                    <DeleteCitizenModal id={citizen.id} fullName={citizen.full_name} />
                  </div>
                </li>
              );
            })
          )}
        </ul>
      </div>
    );
  }
}
