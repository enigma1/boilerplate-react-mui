//import renderer from 'react-test-renderer';
import '@testing-library/jest-dom/extend-expect'
import {render, fireEvent, waitFor, cleanup, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import '^/globals.js'

import Counter from '%/Common/Counter'

describe('Counter Tests', () => {
  it('<Counter /> Initial', () => {
    //const {debug, getByText} = render(<Counter range={[10, 100]} step={1} />);
    const {debug, getByText} = render(<Counter range={[10, 100]} step={1} />);

    waitFor(() => {
      //debug()
      expect(getByText(/Min:10/i)).toBeInTheDocument();
      expect(getByText('10')).toBeInTheDocument();
      expect(getByText('100')).toBeInTheDocument();
      expect(getByText('-').closest('button')).toHaveAttribute('disabled');
      expect(getByText('+').closest('button')).toHaveAttribute('enabled');
      expect(getByText(/reset/i).closest('button')).toHaveAttribute('disabled');
    })
  });

  test("<Counter /> Increment", () => {
    const {getByText} = render(<Counter range={[10, 100]} step={5} />);
    fireEvent.click(getByText('+'))
    waitFor(() => {
      expect(getByText('15')).toBeInTheDocument();
    });
  });

  it("<Counter /> Decrement", () => {
    const {getByText} = render(<Counter range={[10, 100]} step={1} />);
    fireEvent.click(getByText('+'))
    fireEvent.click(getByText('+'))
    fireEvent.click(getByText('+'))
    fireEvent.click(getByText('-'))
    waitFor(() => {
      expect(getByText('12')).toBeInTheDocument();
    });
  })

  test("<Counter /> Reset", async () => {
    const {getByText} = render(<Counter range={[10, 100]} step={1} />);
    fireEvent.click(getByText('+'))
    fireEvent.click(getByText('+'))
    await waitFor(() => {
      expect(getByText('12')).toBeInTheDocument();
    });
    fireEvent.click(getByText(/reset/i))
    waitFor(() => {
      expect(getByText('10')).toBeInTheDocument();
    });
  });
})
