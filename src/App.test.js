import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});


replace(
  outputs('Compose-body'),
  '{{IMAGE_HERE}}',
  concat(
    '<img src="data:image/jpeg;base64,',
    body('Get-file-content-image'),
    '" width="700" />'
  )
)
