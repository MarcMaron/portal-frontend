/********************************************************************************
 * Copyright (c) 2021,2022 BMW Group AG
 * Copyright (c) 2021,2022 Contributors to the CatenaX (ng) GitHub Organisation.
 *
 * See the NOTICE file(s) distributed with this work for additional
 * information regarding copyright ownership.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Apache License, Version 2.0 which is available at
 * https://www.apache.org/licenses/LICENSE-2.0.
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 *
 * SPDX-License-Identifier: Apache-2.0
 ********************************************************************************/

import './style.scss'
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined'
import PowerSettingsNewOutlinedIcon from '@mui/icons-material/PowerSettingsNewOutlined'
import RestartAltOutlinedIcon from '@mui/icons-material/RestartAltOutlined'
import { Box } from '@mui/material'
import {
  Button,
  UserAvatar,
  Typography,
  PageHeader,
  PageNotifications,
} from 'cx-portal-shared-components'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { resetSelector } from 'features/admin/userOwn/slice'
import { putResetPassword } from 'features/admin/userOwn/actions'
import { UserDetailInfo } from 'components/shared/basic/UserDetailInfo'
import { PageBreadcrumb } from 'components/shared/frame/PageBreadcrumb/PageBreadcrumb'
import { useFetchUserDetailsQuery } from 'features/admin/userApiSlice'

export default function UserDetail() {
  const { t } = useTranslation()
  const { userId } = useParams()
  const dispatch = useDispatch()
  const { data } = useFetchUserDetailsQuery(userId ?? '')
  const { resetStatus, error } = useSelector(resetSelector)

  let errorMsg = ''
  if (resetStatus) {
    errorMsg = t('content.account.resetPswrdSuccessMsg')
  } else if (parseInt(error) === 400) {
    errorMsg = t('content.account.resetPswrdMaxLimitError')
  } else if (parseInt(error) === 500) {
    errorMsg = t('content.account.resetPswrdUnsuccessfulError')
  } else if (parseInt(error) === 404) {
    errorMsg = t('content.account.resetPswrdPermissionsError')
  }

  const handleSuspendUser = () => console.log('Suspend user method')

  const handleDeleteUser = () => console.log('Delete user method')

  const handleResetPasswordForUser = () =>
    data && dispatch(putResetPassword(data.companyUserId))

  return (
    <main className="user-details">
      <PageHeader
        title={t('content.account.userAccount')}
        topPage={false}
        headerHeight={200}
      >
        <PageBreadcrumb />
      </PageHeader>
      <section>
        <Box
          sx={{ marginBottom: '75px', display: 'flex', alignItems: 'flex-end' }}
        >
          <Box>
            <Typography
              variant="h6"
              display="block"
              sx={{ paddingBottom: '10px' }}
            >
              {data && `${data.firstName} ${data.lastName}, ${data.email}`}
            </Typography>
            <Button
              color="secondary"
              onClick={handleSuspendUser}
              size="small"
              variant="outlined"
              startIcon={<PowerSettingsNewOutlinedIcon />}
              sx={{ marginRight: '8px' }}
            >
              {t('content.account.suspendAccount')}
            </Button>
            <Button
              color="secondary"
              onClick={handleDeleteUser}
              size="small"
              variant="outlined"
              startIcon={<CancelOutlinedIcon />}
              sx={{ marginRight: '8px' }}
            >
              {t('content.account.deleteAccount')}
            </Button>
            <Button
              color="secondary"
              onClick={handleResetPasswordForUser}
              size="small"
              variant="outlined"
              startIcon={<RestartAltOutlinedIcon />}
            >
              {t('content.account.resetPswrdAccount')}
            </Button>
          </Box>

          <Box sx={{ marginLeft: 'auto' }}>
            <UserAvatar size="large" />
          </Box>
        </Box>
        <div className="errorMsg">
          {error && (
            <PageNotifications
              title={t(
                'content.usermanagement.appUserDetails.roles.error.title'
              )}
              description={errorMsg}
              open
              severity="error"
            />
          )}
        </div>
        {data && <UserDetailInfo user={data} />}
      </section>
    </main>
  )
}