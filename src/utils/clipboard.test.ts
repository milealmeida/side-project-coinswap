import { copyText } from './clipboard';

describe('copyText', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('uses the clipboard API when writeText is available', async () => {
    const writeText = jest.fn().mockResolvedValue(undefined);
    const createElement = jest.spyOn(document, 'createElement');

    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText }
    });

    await copyText('hello');

    expect(writeText).toHaveBeenCalledWith('hello');
    expect(createElement).not.toHaveBeenCalled();
  });

  it('falls back to a hidden textarea and execCommand', async () => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: undefined
    });
    const execCommand = jest.fn().mockReturnValue(true);
    document.execCommand = execCommand;

    await copyText('hello');

    expect(execCommand).toHaveBeenCalledWith('copy');
    expect(document.body.querySelector('textarea')).toBeNull();
  });
});
