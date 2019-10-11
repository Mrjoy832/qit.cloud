import React from 'react'
import { shallow } from 'enzyme'
import { Logo } from '../components/Header/Logo'
import '@testing-library/jest-dom/extend-expect'

it('should render correctly', () => {
  const component = shallow(<Logo />)
  expect(component).toMatchSnapshot()
})
