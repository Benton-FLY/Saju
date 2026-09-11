import type { PersonInput } from '../types';
export function PersonForm({
  person,
  onChange,
  isParent,
}: {
  person: PersonInput;
  onChange: (p: PersonInput) => void;
  isParent: boolean;
}) {
  const set = <K extends keyof PersonInput>(key: K, value: PersonInput[K]) =>
    onChange({ ...person, [key]: value });
  return (
    <div className="person-fields">
      <fieldset>
        <legend>{isParent ? '나는 아이의' : '아이는 나의'}</legend>
        <div className="role-options">
          {(isParent ? (['엄마', '아빠'] as const) : (['딸', '아들'] as const)).map((role) => (
            <button
              type="button"
              key={role}
              className={`role-option ${person.role === role ? 'selected' : ''}`}
              aria-pressed={person.role === role}
              onClick={() => set('role', role)}
            >
              <span className="role-symbol">{role === '엄마' || role === '딸' ? '◡' : '◠'}</span>
              {role}
              <span className="radio-dot" />
            </button>
          ))}
        </div>
      </fieldset>
      <label className="field-label" htmlFor="nickname">
        이름 또는 별명 <span>공유할 때도 이 이름으로 보여요</span>
      </label>
      <input
        id="nickname"
        name="nickname"
        className="soft-input"
        placeholder={isParent ? '예: 다정한 엄마' : '예: 우리 서윤'}
        value={person.nickname}
        maxLength={12}
        required
        autoComplete="off"
        onChange={(e) => set('nickname', e.target.value)}
      />
      <div className="date-heading">
        <label className="field-label" htmlFor="birth-year">
          생년월일
        </label>
        <div className="segmented" aria-label="달력 종류">
          {(['solar', 'lunar'] as const).map((calendar) => (
            <button
              key={calendar}
              type="button"
              aria-pressed={person.calendar === calendar}
              className={person.calendar === calendar ? 'active' : ''}
              onClick={() => onChange({ ...person, calendar, leapMonth: false })}
            >
              {calendar === 'solar' ? '양력' : '음력'}
            </button>
          ))}
        </div>
      </div>
      <div className="date-fields">
        <label>
          <input
            id="birth-year"
            aria-label="태어난 연도"
            placeholder="1990"
            inputMode="numeric"
            pattern="[0-9]{4}"
            maxLength={4}
            required
            value={person.year}
            onChange={(e) => set('year', e.target.value.replace(/\D/g, ''))}
          />
          <span>년</span>
        </label>
        <label>
          <input
            aria-label="태어난 월"
            placeholder="01"
            inputMode="numeric"
            pattern="[0-9]{1,2}"
            maxLength={2}
            required
            value={person.month}
            onChange={(e) => set('month', e.target.value.replace(/\D/g, ''))}
          />
          <span>월</span>
        </label>
        <label>
          <input
            aria-label="태어난 일"
            placeholder="01"
            inputMode="numeric"
            pattern="[0-9]{1,2}"
            maxLength={2}
            required
            value={person.day}
            onChange={(e) => set('day', e.target.value.replace(/\D/g, ''))}
          />
          <span>일</span>
        </label>
      </div>
      {person.calendar === 'lunar' && (
        <label className="check-line lunar-check">
          <input
            type="checkbox"
            checked={person.leapMonth}
            onChange={(e) => set('leapMonth', e.target.checked)}
          />{' '}
          윤달에 태어났어요 <span>해당하는 경우만 선택</span>
        </label>
      )}
      <div className="time-heading">
        <label className="field-label" htmlFor="birth-time">
          태어난 시간
        </label>
        <label className="check-line">
          <input
            type="checkbox"
            checked={person.unknownTime}
            onChange={(e) => set('unknownTime', e.target.checked)}
          />
          시간 모름
        </label>
      </div>
      <input
        className="soft-input time-input"
        id="birth-time"
        type="time"
        min="00:00"
        max="23:59"
        required={!person.unknownTime}
        disabled={person.unknownTime}
        value={person.unknownTime ? '' : person.time}
        onChange={(e) => set('time', e.target.value)}
      />
      <p className="field-help">
        {person.unknownTime
          ? '괜찮아요. 태어난 시간 없이도 볼 수 있어요.'
          : '한국 표준시 기준으로 입력해주세요.'}
      </p>
    </div>
  );
}
