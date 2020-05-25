
import React, { Component } from 'react';
import BarChart from './bars.js'
import DrawGrapho from './drawGrapho.js'

export default class ControllerBar extends Component {

  render() {
    return(
      <div className="controller">
      <h2>Sample 01 plot Bars</h2>
        <div>
         <BarChart  data = "https://raw.githubusercontent.com/cFabianR/Prubas/master/src/XYZ.csv"
                    headerX = "year"
                    headerY = "value"/>
        </div>
      </div>

    )
  }
}

export  class ControllerGrapho extends Component {

  render() {
    return(
      <div className="controller">
        <h2>Sample 02  Grapho</h2>
        <div>
         <DrawGrapho data = "https://raw.githubusercontent.com/cFabianR/Prubas/master/miserables.json"/>
        </div>
      </div>

    )
  }
}
