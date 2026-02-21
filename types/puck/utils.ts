import type { Config, ExtractConfigParams } from './config'
import type { DefaultRootFieldProps, PuckContext } from './props'
import type { ComponentData, Data } from './data'
import type { PrivateAppState } from './internal'
import type { AppState } from './app-state'

export type WithId<Props> = Props & { id: string }

export type WithPuckProps<Props> = Props & {
  puck: PuckContext
  editMode?: boolean
}

export type AsFieldProps<Props> = Omit<Props, 'children' | 'puck' | 'editMode'>

export type WithChildren<Props> = Props & { children: unknown }

export type UserGenerics<
  UserConfig extends Config = Config,
  UserParams extends ExtractConfigParams<UserConfig> = ExtractConfigParams<UserConfig>,
  UserData extends
    | Data<UserParams['props'], UserParams['rootProps']>
    | Data = Data<UserParams['props'], UserParams['rootProps']>,
  UserAppState extends PrivateAppState<UserData> = PrivateAppState<UserData>,
  UserPublicAppState extends AppState<UserData> = AppState<UserData>,
  UserComponentData extends ComponentData = UserData['content'][0]
> = {
  UserConfig: UserConfig
  UserParams: UserParams
  UserProps: UserParams['props']
  UserRootProps: UserParams['rootProps'] & DefaultRootFieldProps
  UserData: UserData
  UserAppState: UserAppState
  UserPublicAppState: UserPublicAppState
  UserComponentData: UserComponentData
  UserField: UserParams['field']
}

export type ExtractField<
  UserField extends { type: PropertyKey },
  T extends UserField['type']
> = Extract<UserField, { type: T }>
