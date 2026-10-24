import * as _ from 'lodash';

const mailerRb = `# frozen_string_literal: true

class AdminMailer < ApplicationMailer
  layout 'plain_mailer'

  helper :accounts

  def new_report(recipient, report)
    @report   = report
    @me       = recipient
    @instance = Rails.configuration.x.local_domain

    locale_for_account(@me) do
      mail to: @me.user_email, subject: I18n.t('admin_mailer.new_report.subject', instance: @instance, id: @report.id)
    end
  end

  def new_pending_account(recipient, user)
    @account  = user.account
    @me       = recipient
    @instance = Rails.configuration.x.local_domain

    locale_for_account(@me) do
      mail to: @me.user_email, subject: I18n.t('admin_mailer.new_pending_account.subject', instance: @instance, username: @account.username)
    end
  end

  def new_trending_tag(recipient, tag)
    @tag      = tag
    @me       = recipient
    @instance = Rails.configuration.x.local_domain

    locale_for_account(@me) do
      mail to: @me.user_email, subject: I18n.t('admin_mailer.new_trending_tag.subject', instance: @instance, name: @tag.name)
    end
  end
end
`;

export const enumerations = _.map(
  _.shuffle(
    _.flatten(
      _.times(16, () => [
        {
          severity: 'high',
          confidence: 'firm',
          findingTitle: 'Missing certificate',
          affectedFileName: 'user.rb:57',
          description:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum vehicula elementum lacinia curabitur eu vehicula lectus. Morbi malesuada justo ut enim egestas, vel ullamcorper risus viverra. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Nam at scelerisque velit. Donec ut lacinia tellus, lobortis facilisis lectus. Quisque rhoncus, magna non venenatis fermentum, mi erat egestas leo, vel tempor quam diam lobortis augue. ',
          testerNotes: 'This section specs need to be discussed',
          file: mailerRb,
        },
        {
          severity: 'low',
          confidence: 'firm',
          findingTitle: 'Weak updater',
          affectedFileName: 'Gamefile.lock:200',
          description:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum vehicula elementum lacinia curabitur eu vehicula lectus. Morbi malesuada justo ut enim egestas, vel ullamcorper risus viverra. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Nam at scelerisque velit. Donec ut lacinia tellus, lobortis facilisis lectus. Quisque rhoncus, magna non venenatis fermentum, mi erat egestas leo, vel tempor quam diam lobortis augue. ',
          testerNotes: 'This section specs need to be discussed',
          file: mailerRb,
        },
        {
          severity: 'medium',
          confidence: 'firm',
          findingTitle: 'Cross Site Scripting',
          affectedFileName: 'controllers/application_controller.rb:1',
          description:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum vehicula elementum lacinia curabitur eu vehicula lectus. Morbi malesuada justo ut enim egestas, vel ullamcorper risus viverra. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Nam at scelerisque velit. Donec ut lacinia tellus, lobortis facilisis lectus. Quisque rhoncus, magna non venenatis fermentum, mi erat egestas leo, vel tempor quam diam lobortis augue. ',
          testerNotes: 'This section specs need to be discussed',
          file: mailerRb,
        },
      ])
    )
  ),
  (enumeration) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    enumeration.key = _.uniqueId('enumerationID_');
    return enumeration;
  }
);
