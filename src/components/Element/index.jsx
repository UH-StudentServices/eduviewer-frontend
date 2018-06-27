/* eslint-disable */

import React from 'react';

import Rule from '../Rule';
import { getElementStructure , qs } from '../../utils';

export default class Element extends React.Component {
  componentWillReceiveProps(nextProps) {
    console.log(`element ${this.props.id} received updated properties`);
    console.log(nextProps);
    console.log(this.props);
  }

  componentDidUpdate() {
    console.log(`element updated: ${this.props.elem.id}, lv: ${this.props.lv}`);
  }

  render() {
    if (this.props.elem.documentState == 'DELETED') {
      return (<div />);
    }
    const elem = this.props.elem;
    switch (elem.type) {
      case 'Education':
        return this.renderEducation(elem);
      case 'DegreeProgramme':
      // return this.renderDegreeProgramme(elem);
      case 'GroupingModule':
      // return this.renderGroupingModule(elem);
      case 'StudyModule':
        // return this.renderStudyModule(elem);
        return this.renderOtherTypes(elem);
      default:
        return (
          <ul>
            <li>
              tuntematon tyyppi
              {' '}
              {elem.type}
            </li>
          </ul>
        );
    }
  }

  renderEducation(elem) {
    const structure = getElementStructure(elem.structure, this.props.lv);
    console.log('stucture');
    console.log(structure);

    return (
      <div>
        <li>
          {elem.documentState == 'DRAFT' && (
            <b>
              (LUONNOS)
            </b>
          )}
          {' '}
          <b>
            {elem.name.fi}
          </b>
        </li>
        {qs.debug == 'true' && (
          <li>
            id:
            {elem.id}
            {' '}

          </li>
        )}
        <li>
          {structure}
        </li>
      </div>
    );
  }

  renderOtherTypes(elem) {
    return (
      <ul>
        {this.renderElementHeader(elem)}
        <Rule key={`rule-${elem.rule.localId}`} rule={elem.rule} lv={this.props.lv} elem={elem} />
      </ul>
    );
  }

  renderElementHeader(elem) {
    let credits = null;
    if (elem.targetCredits != null) {
      if (elem.targetCredits.min != elem.targetCredits.max) {
        credits = `${elem.targetCredits.min}-${elem.targetCredits.max}`;
      } else if (elem.targetCredits.max == null) {
        credits = `väh. ${elem.targetCredits.min}`;
      } else {
        credits = elem.targetCredits.min;
      }
      credits += ' op';
    }

    return (
      <div>

        {credits != null && (
          <li>
            {' '}
            {elem.documentState == 'DRAFT' && (
              <b>
                (DRAFT)
              </b>
            )}
            {' '}
            <b>
              {elem.code}
              {' '}
              {elem.name.fi}
            </b>
            {' '}
            (
            <b>
              {credits}
            </b>
            )
          </li>
        )}
        {credits == null && (
          <li>
            {' '}
            {elem.documentState == 'DRAFT' && (
              <b>
                (DRAFT)
              </b>
            )}
            {' '}
            <b>
              {elem.code}
              {' '}
              {elem.name.fi}
            </b>
          </li>
        )}
        {qs.debug == 'true' && (
          <li>
            id:
            {elem.id}
          </li>
        )}
        {qs.debug == 'true' && (
          <li>
            {elem.type}
          </li>
        )}
      </div>);
  }
}
