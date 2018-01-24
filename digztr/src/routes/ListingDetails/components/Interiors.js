import React, { Component } from 'react';

class Interiors extends Component {
  renderInterior() {
    return (
      this.props.interiors.map((item,index) => {
        return (
          <div className="col-xs-12 col-sm-6 col-md-4" key={index} style={{marginLeft:"40px"}}>
            <p>
              {item.type} <br />
              <div style={{whiteSpace: "pre"}}>
                {item.values.map(item => {return `${item} \n`})}
              </div>
            </p>
          </div>
        )
      })
    );
  }
  renderConstruction(){
    const { construction } = this.props;
    if (construction.length) {
      return (
        construction.map((item,index) => {
          return (
            <div className="col-xs-12 col-sm-6 col-md-4" key={index} style={{marginLeft:"40px"}}>
            <p>
            {item.type} <br />
            <div style={{whiteSpace: "pre"}}>
            {item.values.map(item => {return `${item} \n`})}
            </div>
            </p>
            </div>
          );
        })
      );
    } else {
      return null;
    }
  }
  render(){
    const { interiors } = this.props;
    if (interiors.length) {
      return (
        <div id="section-05" className="section">
          <h5 className="sec-title violet-text">Interior Features</h5>
          <div className="row interior-features-content">
            {this.renderInterior()}
          </div>

          <h5 className="sec-title violet-text">Construction</h5>
          <div className="row interior-features-content">
            {this.renderConstruction()}
          </div>
        </div>
      );
    }else{
      return null;
    }

  }
}

export default Interiors;
