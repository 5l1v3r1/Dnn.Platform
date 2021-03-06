﻿// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.
// See the LICENSE file in the project root for more information

using DotNetNuke.Security.Permissions;

namespace DotNetNuke.Entities.Content.Workflow.Entities
{
    /// <summary>
    /// This entity represents a state permission
    /// </summary>
    public class WorkflowStatePermission : PermissionInfoBase
    {
        /// <summary>
        /// Workflow state permission Id
        /// </summary>
        public int WorkflowStatePermissionID { get; set; }

        /// <summary>
        /// State Id
        /// </summary>
        public int StateID { get; set; }
    }
}
