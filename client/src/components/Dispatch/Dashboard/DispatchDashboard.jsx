import React, { Component } from 'react';
import TopDispatchArea from './TopDispatchArea/TopDispatchArea';
import ActiveUnits from './ActiveUnits';
import UpdateAop from './UpdateAop';
import SuccessMessage from '../../Partials/Messages/SuccessMessage';
import DispatchActiveCalls from './DispatchActiveCalls';
import ActiveBolos from '../../ActiveBolos';
import CreateBoloModal from '../../Modals/CreateBoloModal';
import CallEmergencyServicesModal from "../../Modals/CallEmergencyServicesModal"

export default class DispatchDashboard extends Component {
  constructor() {
    super();

    this.state = {
      message: sessionStorage.getItem('dispatch-message'),
    };
  }

  componentDidMount() {
    document.title = 'Dispatch Dashboard';

    document.addEventListener(
      'beforeunload',
      sessionStorage.removeItem('dispatch-message')
    );
  }

  render() {
    const { message } = this.state;
    return (
      <div className='container-fluid text-light pb-5'>
        {message ? <SuccessMessage message={message} dismiss /> : null}
        <TopDispatchArea />
        <div className='row mt-3'>
          <ActiveUnits />
          <UpdateAop />
        </div>
        <DispatchActiveCalls />
        <ActiveBolos />

        {/* Modals */}
        <CreateBoloModal />
        <CallEmergencyServicesModal to="/dispatch" messageType="dispatch-message" />
      </div>
    );
  }
}
