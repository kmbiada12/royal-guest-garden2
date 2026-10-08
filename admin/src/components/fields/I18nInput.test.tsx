import { useState } from 'react';
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { I18nInput } from './I18nInput';
import type { I18nForm } from '@/lib/i18n';

function Harness({ initial }: { initial: I18nForm }) {
  const [value, setValue] = useState(initial);
  return <I18nInput id="t" label="Titre" value={value} onChange={setValue} />;
}

describe('I18nInput', () => {
  it('shows French and English side by side', () => {
    render(<Harness initial={{ fr: 'Bonjour', en: 'Hello' }} />);
    expect(screen.getByLabelText('Titre (français)')).toHaveValue('Bonjour');
    expect(screen.getByLabelText('Titre (anglais)')).toHaveValue('Hello');
    expect(screen.queryByText(/traduction anglaise manquante/)).not.toBeInTheDocument();
  });

  it('flags a missing English translation until it is typed', async () => {
    render(<Harness initial={{ fr: 'Bonjour', en: '' }} />);
    expect(screen.getByText(/traduction anglaise manquante/)).toBeInTheDocument();
    await userEvent.type(screen.getByLabelText('Titre (anglais)'), 'Hello');
    expect(screen.queryByText(/traduction anglaise manquante/)).not.toBeInTheDocument();
  });
});
