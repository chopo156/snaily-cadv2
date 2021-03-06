import React, { Component } from 'react';
import Axios from 'axios';
import { backendURL } from '../../../../config/config';
import Cookies from 'js-cookie';
import ErrorMessage from '../../../Partials/Messages/ErrorMessage';


export default class AddEthnicity extends Component {
  constructor() {
    super();

    this.state = {
      ethnicity: '',
      error: ""
    };
  }

  onSubmit = (e) => {
    e.preventDefault();

    Axios({
      url: backendURL + '/admin/ethnicities/add',
      method: "POST",
      headers: {
        'x-auth-snailycad-token': Cookies.get('__session'),
      },
      data: {
        ethnicity: this.state.ethnicity,
      },
    })
    .then(res => {
        if (res.data.msg === "Added") {
            sessionStorage.setItem("admin-message", "Successfully Added Ethnicity");
            return window.location = "/admin/ethnicities";
        }

        this.setState({
            error: res.data.msg
        })
    })
    .catch(err => console.log(err));
  };

  onChange = (e) => {
      this.setState({
          [e.target.name]: e.target.value
      })
  }

  componentDidMount() {
      document.title = "Add Ethnicity - Admin"
  }

  render() {
    const { ethnicity, error } = this.state;
    return (
      <form className="col-md-9 container text-light" onSubmit={this.onSubmit}>
        {
            error ? <ErrorMessage message={error} /> : null
        }

        <div className='form-group'>
          <label htmlFor='ethnicity'>Enter Ethnicity Name</label>
          <input
            type='text'
            name='ethnicity'
            id='ethnicity'
            className="form-control bg-dark border-dark text-light"
            value={ethnicity}
            onChange={this.onChange}
          />
        </div>
        <div className="form-group float-right">
            <a href="/admin/ethnicities" className="btn btn-danger">Cancel</a>
            <button className="btn btn-primary ml-2" type="submit">Add Ethnicity</button>
        </div>
      </form>
    );
  }
}
