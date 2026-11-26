export const mobileBattleLayout = {
  screenShakeScale: 2.5,
  screenShakeDuration: 1000,
  arena: {
    sideInset: 12
  },
  log: {
    height: 'min(85px, 23dvh)',
    rowHeight: 'min(32px, calc(11.5dvh - 12px))',
    topOffset: 0,
    leftInset: 10,
    rightInset: 70,
    padding: '4px 6px',
    rowGap: 6,
    listPadding: '0 2px',
    borderWidth: 2
  },
  logRow: {
    turnWidth: 62,
    resultWidth: 55,
    padding: '0 6px',
    turnGap: 4,
    turnFontSize: 17,
    iconSize: 'min(28px, 6.5dvh)',
    damageHeight: 'min(24px, 7dvh)',
    damageFontSize: 11
  },
  enemy: {
    width: 'min(78cqw, 48dvh)',
    landscapeWidth: 'min(54cqw, 72dvh)',
    left: '50%',
    landscapeLeft: '34%',
    minTop: '18%',
    logGap: 90,
    landscapeLogGap: -34,
    height: '38%',
    landscapeHeight: '61%'
  },
  hp: {
    scale: '1.5',
    width: 'min(54cqw, 260px)',
    landscapeWidth: 'min(26cqw, 260px)',
    playerLeft: '35%',
    playerGap: 16,
    enemyLogGap: 8,
    enemyRight: '3.5%',
    enemyRightOffset: 0
  },
  enemyLevel: {
    scale: 1.2,
    offsetX: 20,
    rowWidth: '62%',
    gap: 0,
    iconWidth: 'clamp(24px, 8cqw, 36px)',
    mistTop: '85%',
    mistLeft: '50%',
    width: 'min(100%, 36px)',
    badgeOffset: -1,
    padding: '4px 2px',
    fontSize: 10,
    marginTop: 5,
    mistSize: 60
  },
  message: {
    height: 'clamp(60px, 12dvh, 88px)',
    fontSize: 18,
    letterSpacing: '0.06em',
    top: '65%',
    landscapeWidth: 'min(56cqw, 440px)'
  },
  movePreview: {
    left: '50%',
    top: '60%',
    landscapeLeft: '34%',
    landscapeTop: '34%',
    width: 'min(58cqw, 44dvh)',
    buttonWidth: 'min(42cqw, 49dvh)',
    overlap: '44px',
    sparksWidth: 'min(100cqw, 100dvh)'
  },
  buttons: {
    gap: 'clamp(12px, 5cqw, 24px)',
    width: '27cqw',
    landscapeWidth: 'clamp(48px, min(42cqw, 16dvh), 88px)',
    bottom: 30,
    left: '49%',
    landscapeLeft: '80%'
  },
  battleAction: {
    minWidth: 160,
    height: 35,
    fontSize: 12,
    gap: 10,
    paddingInline: 12
  },
  playerLevel: {
    fontSize: 'clamp(10px, 3cqw, 13px)',
    borderWidth: 1,
    textOffset: 1,
    width: '11cqw',
    landscapeWidth: 'clamp(23px, 7.2cqw, 33px)',
    rightOffset: -16,
    bottomOffset: -5,
    previewOffsetX: -5,
    previewOffsetY: -5
  },
  stoneBadge: {
    scale: 1.1,
    width: 38,
    height: 43,
    padding: 4,
    fontSize: 10,
    iconSize: 30,
    textOffset: -4,
    playerGap: 6,
    enemyGap: 8,
    enemyBottom: 2,
    landscapePlayerGap: 4
  }
} as const;
