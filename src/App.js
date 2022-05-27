import React, { Component } from 'react';
import '@progress/kendo-theme-default/dist/all.css';
import './App.css';
import { process } from '@progress/kendo-data-query';
import { Grid, GridColumn } from '@progress/kendo-react-grid';
import { Window, Dialog } from '@progress/kendo-react-dialogs';
import {Oval} from "react-loader-spinner";
import { Button } from "@progress/kendo-react-buttons";

class App extends Component {

  constructor(props) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.first = React.createRef()
    this.state = {
      dropdownlistCategory: null,
      gridDataState: {
        sort: [
          { field: "ProductName", dir: "asc" }
        ],
        skip: 0,
        take: 10
      },
      isLoading: false,
      userName: '',
      first: '',
      last: '',
      test:'Fuck',
      lastLogin:'',
      enabled: '',
      show: false,
      windowVisible: false,
      gridClickedRow: {},

      users: [
        {
          "UserName": "John5834",
          "FullName": "John Doe",
          "LastLogin": "May-03-2022",
          "Enabled": "Yes"
        },
        {
          "UserName": "Dave5923",
          "FullName": "Dave Mill",
          "LastLogin": "May-03-2022",
          "Enabled": "Yes"
        },
        {
          "UserName": "Mick4923",
          "FullName": "Mick Rogers",
          "LastLogin": "May-03-2022",
          "Enabled": "Yes"
        },
        {
          "UserName": "Love4923",
          "FullName": "Love Bratt",
          "LastLogin": "May-03-2022",
          "Enabled": "No"
        }
      ]
    }
  }

  toggleDialog = () => {
    this.setState({
      show: !this.state.show
    })
  }


  componentWillMount() {
    this.setState({isLoading:true})
    setTimeout(() => {
      this.setState({ isLoading: false })
    }, 1000)
  }

  handleGridDataStateChange = (e) => {
    this.setState({ gridDataState: e.dataState })
  }

  handleGridRowClick = (e) => {
    this.setState({
      windowVisible: true,
      gridClickedRow: e.dataItem
    })
  }

  closeWindow = (e) => {
    this.setState({
      windowVisible: false
    })
  }

  handleSubmit = (e) => {
    this.setState({ isLoading: true })
    e.preventDefault()

    if (this.state.first.length > 25 || this.state.last.length > 25) {
      this.setState({ isLoading: false })
    } else if (this.state.first.length+this.state.last.length > 40) {
      this.setState({ isLoading: false })
    } else {
      let items = this.state.users
      let usernameTaken = false
      items.forEach(item => {
        for (let key in item) {
          if (key === "UserName" && item[key] === this.state.userName) {
            usernameTaken = true
          }
        }
      })

    
      if (usernameTaken === false) {
        let latestList = this.state.users
        latestList.push(
          {
            "UserName": this.state.userName,
            "FullName": this.state.first + " " + this.state.last,
            "LastLogin": this.state.lastLogin,
            "Enabled": this.state.enabled
          }
        )
        this.setState({ isLoading: false })
      } else {
        this.setState({ isLoading: false })
      } 
    }

  }

  handleUpdate = (e) => {
    // this.setState({ isLoading: true })
    e.preventDefault()
    // alert(this.state.test.length)
    if (this.state.gridClickedRow.FullName.length > 40) {
      this.setState({ isLoading: false })
    } else {
      let users = this.state.users
      let userFound = false
      users.forEach(user => {
        for (let key in user) {
          if (key === "UserName" && user[key] === this.state.gridClickedRow.UserName) {
            userFound = true
          }
        }
      })

      if (userFound === true) {
        const updatedArr = users.filter(data => data.UserName !== this.state.gridClickedRow.UserName)
        // this.setState({users: updatedArr})
        let latestList = updatedArr
        latestList.push(
          {
            "UserName": this.state.gridClickedRow.UserName,
            "FullName": this.state.gridClickedRow.FullName,
            "LastLogin": this.state.gridClickedRow.LastLogin,
            "Enabled": this.state.gridClickedRow.Enabled
          }
        )
        this.setState({ users: latestList })
        this.setState({ isLoading: false })
      }


    }

  }

  onChange(e) {
    this.setState(prevState => ({
      gridClickedRow: {
        ...prevState.gridClickedRow,
        [e.target.name]: e.target.value
      }
    }))
  }

  rowRender = (trElement, props) => {
    let available
    props.dataItem.Enabled === 'Yes' ? available = true : available = false
    const red = {
      backgroundColor: "rgb(243, 23, 0, 0.32)",
    }
    const trProps = {
      style: available ? null : red,
    }
    return React.cloneElement(
      trElement,
      { ...trProps },
      trElement.props.children
    )
  }

  

  render() {
    if (this.state.isLoading===true) {
      return (
        <div className="loader">
          <Oval
            ariaLabel="loading-indicator"
            height={80}
            width={80}
            strokeWidth={4}
            color="#222222"
            secondaryColor="grey"
          />
        </div>
      )
    } else {
      return (
        <div className="App" id="root">

          <header className="App-header">
            {this.state.show && (
              <Dialog title={"Add New User"} onClose={this.toggleDialog}>
                <div style={{ padding: "10px 20px 20px 20px", textAlign: 'center',width:400,}}>
                  <form onSubmit={(e) => { this.handleSubmit(e) }}>
                    <input type="text"  name="username" style={{ borderRadius: 5, width: '100%', marginBottom: 20, height: 40 }} placeholder="Username" onChange={(e) => this.setState({ userName: e.target.value })} required />
                    <input type="text"  name="first" style={{ borderRadius: 5, width: '100%', marginBottom: 20, height: 40 }} placeholder="First Name" onChange={(e) => this.setState({ first: e.target.value })} required />
                    <input type="text"  name="last" style={{ borderRadius: 5, width: '100%', marginBottom: 20, height: 40 }} placeholder="Last Name" onChange={(e) => this.setState({ last: e.target.value })} required />
                    <input type="text"  name="lastlogin" style={{ borderRadius: 5, width: '100%', marginBottom: 20, height: 40 }} placeholder="Last Login" onChange={(e) => this.setState({ lastLogin: e.target.value })} required />

                    <label>Enabled?</label><br/>
                    <input type="radio" id="yes" name="enabled" value="Yes" onChange={(e) => this.setState({ enabled: e.target.value })} />
                    <label for="yes">Yes</label><br/>
                    <input type="radio" id="no" name="enabled" value="No" onChange={(e) => this.setState({ enabled: e.target.value })} />
                    <label for="no">No</label><br />
                    <Button type='submit' themeColor={"success"} style={{ padding: '10px 20px', marginTop: 20 }}>Submit</Button>
                  </form>
                </div>
              </Dialog>
            )}

            <h1>USERS</h1>
            <p>
              <Button themeColor={"secondary"} onClick={this.toggleDialog}>Add User</Button>
            </p>
            <Grid
              onRowClick={this.handleGridRowClick}
              data={process(this.state.users, this.state.gridDataState)}
              pageable={true}
              sortable={true}
              {...this.state.gridDataState}
              onDataStateChange={this.handleGridDataStateChange}
              rowRender={this.rowRender}
              style={{ height: "400px" }}>
              <GridColumn field="UserName" title="Username" />
              <GridColumn field="FullName" title="Full Name" />
              <GridColumn field="LastLogin" title="Last Login" />
              <GridColumn field="Enabled"/>
            </Grid>

            {this.state.windowVisible &&
              <Window
                title="User Details"
                onClose={this.closeWindow}
                height={250}>
                <dl style={{ textAlign: "left" }}>
                  <form onSubmit={(e) => { this.handleUpdate(e) }}>
                    <input type="text"  name="UserName" style={{ borderRadius: 5, width: '100%', marginBottom: 20, height: 40 }} placeholder="Username" defaultValue={this.state.gridClickedRow.UserName} onChange={(e) => { this.setState({ gridClickedRow: {UserName: e.target.value}  }) }} disabled />

                    <input type="text"  name="FullName" style={{ borderRadius: 5, width: '100%', marginBottom: 20, height: 40 }} placeholder="First Name" defaultValue={this.state.gridClickedRow.FullName} onChange={(value) => this.onChange(value)} required />

                    <input type="text"  name="LastLogin" style={{ borderRadius: 5, width: '100%', marginBottom: 20, height: 40 }} placeholder="Last Login" defaultValue={this.state.gridClickedRow.LastLogin} onChange={(value) => this.onChange(value)} required />


                    <label>Enabled?</label><br/>
                    <input type="radio" id="yes" name="Enabled" value="Yes" defaultValue={this.state.gridClickedRow.Enabled} onChange={(value) => this.onChange(value)} />
                    <label for="yes">Yes</label><br />
                    <input type="radio" id="no" name="Enabled" value="No" defaultValue={this.state.gridClickedRow.Enabled} onChange={(value) => this.onChange(value)} />
                    <label for="no">No</label><br />

                    <button type='submit' themeColor={"success"} style={{ padding: '10px 20px',marginTop:20 }} >Submit</button>
                  </form>
                </dl>
              </Window>
            }
          </header>
        </div>
      )
    }
  }
}

export default App


