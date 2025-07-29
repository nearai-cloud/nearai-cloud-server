import { logger } from './logger';
import { config } from '../config';
import { ENV } from '../utils/envs';
import { SLACK_ALERT_TAG } from '../utils/consts';

export async function sendSlackInfo(
  message: string,
  {
    emitLog = true,
    channel = false,
  }: {
    emitLog?: boolean;
    channel?: boolean;
  } = {},
) {
  if (emitLog) {
    logger.info(message);
  }

  try {
    await sendSlackAlert(SLACK_ALERT_TAG, ENV, message, '💡INFO', channel);
  } catch (e: unknown) {
    logger.error(`Failed to send Slack info: ${e}`);
  }
}

export async function sendSlackWarning(
  message: string,
  {
    emitLog = true,
    channel = false,
  }: {
    emitLog?: boolean;
    channel?: boolean;
  } = {},
) {
  if (emitLog) {
    logger.warn(message);
  }

  try {
    await sendSlackAlert(SLACK_ALERT_TAG, ENV, message, '⚠️WARN', channel);
  } catch (e: unknown) {
    logger.error(`Failed to send Slack warning: ${e}`);
  }
}

export async function sendSlackError(
  message: string,
  {
    emitLog = true,
    channel = false,
  }: {
    emitLog?: boolean;
    channel?: boolean;
  } = {},
) {
  if (emitLog) {
    logger.error(message);
  }

  try {
    await sendSlackAlert(SLACK_ALERT_TAG, ENV, message, '❌ERROR', channel);
  } catch (e: unknown) {
    logger.error(`Failed to send Slack error: ${e}`);
  }
}

async function sendSlackAlert(
  tag: string,
  env: string,
  message: string,
  level: string,
  channel: boolean,
) {
  await sendSlackMessage(
    `${channel ? '<!channel>' : ''} *${tag}@${env}:* *[${level}]* ${message}`,
  );
}

async function sendSlackMessage(message: string) {
  if (!config.slack.webhookUrl) {
    return;
  }
  await fetch(config.slack.webhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text: message }),
  });
}
