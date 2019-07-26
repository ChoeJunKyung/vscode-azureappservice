/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IDeployWizardContext } from "../commands/deploy/deploy";
import { configurationSettings, extensionPrefix, none } from "../constants";
import { WebAppTreeItem } from "../explorer/WebAppTreeItem";
import { ext } from '../extensionVariables';
import { getWorkspaceSetting, updateGlobalSetting, updateWorkspaceSetting } from "../vsCodeConfig/settings";

export async function getDefaultWebAppToDeploy(context: IDeployWizardContext): Promise<WebAppTreeItem | undefined> {
    const defaultWebAppId: string | undefined = getWorkspaceSetting(configurationSettings.defaultWebAppToDeploy, context.fsPath);

    if (defaultWebAppId && defaultWebAppId !== none) {
        const defaultWebApp: WebAppTreeItem | undefined = await ext.tree.findTreeItem(defaultWebAppId, context); // resolves to undefined if app can't be found
        if (defaultWebApp) {
            context.deployedWithConfigs = true;
            context.telemetry.properties.deployedWithConfigs = 'true';
            return <WebAppTreeItem>defaultWebApp;
        } else {
            // if defaultPath or defaultNode cannot be found or there was a mismatch, delete old settings and prompt to save next deployment
            context.fsPath ? await updateWorkspaceSetting(configurationSettings.defaultWebAppToDeploy, undefined, context.fsPath) :
                await updateGlobalSetting(configurationSettings.defaultWebAppToDeploy, undefined);
        }
    }

    return undefined;
}
