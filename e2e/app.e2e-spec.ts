import { LobangKingPage } from './app.po';

describe('lobang-king App', function() {
  let page: LobangKingPage;

  beforeEach(() => {
    page = new LobangKingPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
