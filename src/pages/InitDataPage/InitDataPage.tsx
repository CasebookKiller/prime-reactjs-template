import { type FC, useMemo } from 'react';
import { parseInitData } from '@telegram-apps/sdk';
import { useLaunchParams, type User } from '@telegram-apps/sdk-react';

import { DisplayData, type DisplayDataRow } from '@/components/DisplayData/DisplayData.tsx';

import './InitDataPage.css';

function getUserRows(user: User): DisplayDataRow[] {
  return [
    { title: 'id', value: user.id.toString() },
    { title: 'username', value: user.username },
    { title: 'photo_url', value: user.photoUrl },
    { title: 'last_name', value: user.lastName },
    { title: 'first_name', value: user.firstName },
    { title: 'is_bot', value: user.isBot },
    { title: 'is_premium', value: user.isPremium },
    { title: 'language_code', value: user.languageCode },
    { title: 'allows_to_write_to_pm', value: user.allowsWriteToPm },
    { title: 'added_to_attachment_menu', value: user.addedToAttachmentMenu },
  ];
}

export const InitDataPage: FC = () => {
  console.log('InitDataPage: ', window.location);
  console.log('history:', history)
  const initDataRaw = useLaunchParams().initDataRaw;
  const initData = parseInitData(initDataRaw);

  const initDataRows = useMemo<DisplayDataRow[] | undefined>(() => {
    if (!initData || !initDataRaw) {
      return;
    }
    console.log(initData);
    const {
      hash,
      queryId,
      chatType,
      chatInstance,
      authDate,
      startParam,
      canSendAfter,
    } = initData;
    return [
      { title: 'raw', value: initDataRaw },
      { title: 'auth_date', value: authDate.toLocaleString() },
      { title: 'auth_date (raw)', value: authDate.getTime() / 1000 },
      { title: 'hash', value: hash },
      { title: 'can_send_after (raw)', value: canSendAfter },
      { title: 'query_id', value: queryId },
      { title: 'start_param', value: startParam },
      { title: 'chat_type', value: chatType },
      { title: 'chat_instance', value: chatInstance },
    ];
  }, [initData, initDataRaw]);

  const userRows = useMemo<DisplayDataRow[] | undefined>(() => {
    return initData && initData.user ? getUserRows(initData.user) : undefined;
  }, [initData]);

  const receiverRows = useMemo<DisplayDataRow[] | undefined>(() => {
    return initData && initData.receiver ? getUserRows(initData.receiver) : undefined;
  }, [initData]);

  const chatRows = useMemo<DisplayDataRow[] | undefined>(() => {
    if (!initData?.chat) {
      return;
    }
    const { id, title, type, username, photoUrl } = initData.chat;

    return [
      { title: 'id', value: id.toString() },
      { title: 'title', value: title },
      { title: 'type', value: type },
      { title: 'username', value: username },
      { title: 'photo_url', value: photoUrl },
    ];
  }, [initData]);

  if (!initDataRows) {
    return (
      <>
        <div>
          <section className="app placeholder">
            <img
              alt="Наклейка Telegram"
              src="https://casebookkiller.github.io/prime-reactjs-template/telegram.gif" 
              style={{display: 'block', width: '144px', height: '144px'}}
            />
            <dl>
              <dt>
                Ой
              </dt>
              <dd>
                Приложение было запущено с отсутствующими данными инициализации
              </dd>
            </dl>
          </section>
        </div>
      </>
    );
  }
  
  return (
    <div>
      <DisplayData header={'Данные инициализации'} rows={initDataRows}/>
      {userRows && <DisplayData header={'Пользователь'} rows={userRows}/>}
      {receiverRows && <DisplayData header={'Получатель'} rows={receiverRows}/>}
      {chatRows && <DisplayData header={'Чат'} rows={chatRows}/>}
    </div>
  );

};
