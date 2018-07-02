import React, { Component } from 'react';
import {
  getDegreePrograms,
  getAcademicYearNames,
  getAcademicYearsForDegreeProgram,
  getDegreeProgramForAcademicYear
} from '../../api';

import DegreeProgram from '../DegreeProgram';
import Element from '../OldApp/Element';
import styles from './main.css';
import GroupingModule from '../GroupingModule';

const DEFAULT_ACADEMIC_YEAR = 'hy-lv-68';

class Main extends Component {
  state = {
    degreePrograms: [],
    academicYears: [],
    academicYearNames: {},
    isLoading: false,
    degreeProgram: {},
    academicYear: '',
    showAll: false
  }

  async componentDidMount() {
    this.setState({ isLoading: true });
    const [degreeProgramsResponse, academicYearNames] = await Promise.all(
      [getDegreePrograms(), getAcademicYearNames()]
    );

    const degreePrograms = degreeProgramsResponse.educations;
    console.log(degreePrograms[0].id);
    const academicYears = await getAcademicYearsForDegreeProgram(degreePrograms[0].id);
    const academicYear = this.getAcademicYear(academicYears);

    this.setState({
      degreePrograms,
      academicYear,
      academicYearNames,
      academicYears,
      isLoading: false
    });
  }

   onDegreeProgramsChange = async (event) => {
     const degreeProgramId = event.target.value;
     this.setState({ isLoading: true });
     const academicYears = await getAcademicYearsForDegreeProgram(degreeProgramId);
     const academicYear = this.getAcademicYear(academicYears);
     const degreeProgram = await getDegreeProgramForAcademicYear(degreeProgramId, academicYear);

     this.setState({
       degreeProgram,
       academicYear,
       academicYears,
       isLoading: false
     });
   }

  onAcademicYearsChange = async (event) => {
    const { degreeProgram: { id } } = this.state;
    this.setState({ isLoading: true });
    const academicYear = event.target.value;
    const degreeProgram = await getDegreeProgramForAcademicYear(id, academicYear);
    this.setState({
      degreeProgram,
      academicYear,
      isLoading: false
    });
  }

  onShowAll = () => {
    const { showAll } = this.state;
    this.setState({ showAll: !showAll });
  }

  getAcademicYear = (academicYears) => {
    const { academicYear: oldSelection } = this.state;

    const isOldSelectionValid = oldSelection && academicYears.includes(oldSelection);
    return isOldSelectionValid ? oldSelection : DEFAULT_ACADEMIC_YEAR;
  }

  renderLoader = () => (
    <div className={styles.loader}>
      <span className="icon--spinner icon-spin" />
    </div>
  )

  renderSelections = () => {
    const {
      degreeProgram,
      degreePrograms,
      academicYears,
      academicYearNames,
      academicYear,
      isLoading,
      showAll
    } = this.state;

    if (isLoading) {
      return null;
    }
    const ACADEMIC_YEARS_ID = 'academicYear';
    const DEGREE_PROGRAMS_ID = 'degreePrograms';
    const SHOW_ALL_ID = 'showAll';

    return (
      <div>
        <label htmlFor={DEGREE_PROGRAMS_ID}>
          Koulutusohjelmat
          <select
            name={DEGREE_PROGRAMS_ID}
            id={DEGREE_PROGRAMS_ID}
            value={degreeProgram.id}
            onChange={this.onDegreeProgramsChange}
          >
            { degreePrograms.map(dp => <option key={dp.id} value={dp.id}>{dp.name.fi}</option>) }
          </select>
        </label>
        <label htmlFor={ACADEMIC_YEARS_ID}>
          Lukuvuodet
          <select
            name={ACADEMIC_YEARS_ID}
            id={ACADEMIC_YEARS_ID}
            value={academicYear}
            onChange={this.onAcademicYearsChange}
          >
            {academicYears.map(ay => (
              <option key={ay} value={ay}>
                {academicYearNames[ay]}
              </option>
            ))}
          </select>
        </label>
        <label htmlFor={SHOW_ALL_ID}>
          Näytä kaikki
          <input
            type="checkbox"
            id={SHOW_ALL_ID}
            value={showAll}
            onChange={this.onShowAll}
          />
        </label>
      </div>
    );
  }

  renderContent = () => {
    const {
      degreeProgram, academicYear
    } = this.state;
    if (!academicYear || !degreeProgram.name) {
      return <div>Ei lukuvuosia</div>;
    }
    return (
      <div>
        <DegreeProgram
          key={degreeProgram.id}
          degreeProgram={degreeProgram}
          academicYear={academicYear}
        />
        <Element
          key={degreeProgram.id}
          id={degreeProgram.id}
          elem={degreeProgram}
          lv={academicYear}
        />
      </div>
    );
  }

  render() {
    const { isLoading } = this.state;

    const groupingModule = {
      metadata: {
        revision: 85,
        createdBy: 'hy.i',
        createdOn: '2017-04-21T06:23:31.597',
        lastModifiedBy: 'hkahlos@helsinki.fi',
        lastModifiedOn: '2017-09-07T07:41:11.559',
        modificationOrdinal: 4334987
      },
      id: 'hy-GM-114256325-2017-tieteenala',
      documentState: 'ACTIVE',
      universityOrgIds: ['hy-university-root-id'],
      groupId: 'hy-GM-114256325-2017-tieteenala',
      name: {
        en: 'Discipline-specific studies',
        fi: 'Tieteenalan opinnot',
        sv: 'Studier inom vetenskapsområdet'
      },
      moduleContentApprovalRequired: false,
      code: null,
      curriculumPeriodIds: [],
      type: 'GroupingModule',
      rule: {
        type: 'CompositeRule',
        localId: '8e554dd5-d285-42f7-aaf1-48b4bfffba58',
        rules: [{
          type: 'ModuleRule',
          localId: 'otm-b998798a-7ccc-4ef5-be11-c6ecfbc7f569',
          moduleGroupId: 'hy-SM-118024353'
        }, {
          type: 'ModuleRule',
          localId: 'otm-4c2371bb-d26d-42f9-aad6-4ab24b1fbf07',
          moduleGroupId: 'hy-SM-118024481'
        }],
        require: null,
        description: null,
        allMandatory: true
      }
    };

    return (
      <div>
        <main>
          {isLoading && this.renderLoader()}
          { this.renderSelections()}
          { this.renderContent()}

          <GroupingModule academicYear="hy-lv-68" module={groupingModule} />
        </main>
      </div>
    );
  }
}

export default Main;
