﻿// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.
// See the LICENSE file in the project root for more information

#region Usings

using System;
using System.Collections.Generic;
using System.Linq;
using DotNetNuke.Common.Lists;
using DotNetNuke.Common.Utilities;
using DotNetNuke.Entities.Modules;
using DotNetNuke.Entities.Profile;
using DotNetNuke.Entities.Users;
using DotNetNuke.Framework;
using DotNetNuke.UI.WebControls;
using DotNetNuke.UI.Skins.Controls;
using MembershipProvider = DotNetNuke.Security.Membership.MembershipProvider;

#endregion

namespace DesktopModules.Admin.Security
{
    /// -----------------------------------------------------------------------------
    /// <summary>
    /// The Profile UserModuleBase is used to register Users
    /// </summary>
    /// <remarks>
    /// </remarks>
    /// -----------------------------------------------------------------------------
    public partial class DNNProfile : ProfileUserControlBase
    {
		#region Protected Properties

        /// -----------------------------------------------------------------------------
        /// <summary>
        /// Gets whether to display the Visibility controls
        /// </summary>
        /// -----------------------------------------------------------------------------
        protected bool ShowVisibility
        {
            get
            {
                object setting = GetSetting(PortalId, "Profile_DisplayVisibility");
                return Convert.ToBoolean(setting) && IsUser;
            }
        }

		#endregion

		#region Public Properties

        /// -----------------------------------------------------------------------------
        /// <summary>
        /// Gets and sets the EditorMode
        /// </summary>
        /// -----------------------------------------------------------------------------
        public PropertyEditorMode EditorMode
        {
            get
            {
                return ProfileProperties.EditMode;
            }
            set
            {
                ProfileProperties.EditMode = value;
            }
        }

        /// -----------------------------------------------------------------------------
        /// <summary>
        /// Gets whether the User is valid
        /// </summary>
        /// -----------------------------------------------------------------------------
        public bool IsValid
        {
            get
            {
                return ProfileProperties.IsValid || IsAdmin;
            }
        }

        /// -----------------------------------------------------------------------------
        /// <summary>
        /// Gets and sets whether the Update button
        /// </summary>
        /// -----------------------------------------------------------------------------
        public bool ShowUpdate
        {
            get
            {
                return actionsRow.Visible;
            }
            set
            {
                actionsRow.Visible = value;
            }
        }

        /// -----------------------------------------------------------------------------
        /// <summary>
        /// Gets the UserProfile associated with this control
        /// </summary>
        /// -----------------------------------------------------------------------------
        public UserProfile UserProfile
        {
            get
            {
                UserProfile _Profile = null;
                if (User != null)
                {
                    _Profile = User.Profile;
                }
                return _Profile;
            }
        }

		#endregion

		#region Public Methods

        /// -----------------------------------------------------------------------------
        /// <summary>
        /// DataBind binds the data to the controls
        /// </summary>
        /// -----------------------------------------------------------------------------
        public override void DataBind()
        {
		
            //Before we bind the Profile to the editor we need to "update" the visible data
            var properties = new ProfilePropertyDefinitionCollection();
			var imageType = new ListController().GetListEntryInfo("DataType", "Image");
            foreach (ProfilePropertyDefinition profProperty in UserProfile.ProfileProperties)
            {
                if (IsAdmin && !IsProfile)
                {
                    profProperty.Visible = true;
                }

                if (!profProperty.Deleted && (Request.IsAuthenticated || profProperty.DataType != imageType.EntryID))
                {
                    properties.Add(profProperty);
                }
            }

            ProfileProperties.User = User;
            ProfileProperties.ShowVisibility = ShowVisibility;
            ProfileProperties.DataSource = properties;
            ProfileProperties.DataBind();
        }

		#endregion

		#region Event Handlers

        /// -----------------------------------------------------------------------------
        /// <summary>
        /// Page_Init runs when the control is initialised
        /// </summary>
        /// <remarks>
        /// </remarks>
        /// -----------------------------------------------------------------------------
        protected override void OnInit(EventArgs e)
        {
            base.OnInit(e);
            ID = "Profile.ascx";

            //Get the base Page
            var basePage = Page as PageBase;
            if (basePage != null)
            {
				//Check if culture is RTL
                ProfileProperties.LabelMode = basePage.PageCulture.TextInfo.IsRightToLeft ? LabelMode.Right : LabelMode.Left;
            }
            ProfileProperties.LocalResourceFile = LocalResourceFile;
        }

        /// -----------------------------------------------------------------------------
        /// <summary>
        /// Page_Load runs when the control is loaded
        /// </summary>
        /// <remarks>
        /// </remarks>
        /// -----------------------------------------------------------------------------
        protected override void OnLoad(EventArgs e)
        {
            base.OnLoad(e);
            cmdUpdate.Click += cmdUpdate_Click;
        }

        /// -----------------------------------------------------------------------------
        /// <summary>
        /// cmdUpdate_Click runs when the Update Button is clicked
        /// </summary>
        /// <remarks>
        /// </remarks>
        /// -----------------------------------------------------------------------------
        private void cmdUpdate_Click(object sender, EventArgs e)
        {
            if (IsUserOrAdmin == false && UserId == Null.NullInteger)
            {
                return;
            }

            if (IsValid)
            {
                if (User.UserID == PortalSettings.AdministratorId)
                {
                    //Clear the Portal Cache
                    DataCache.ClearPortalCache(UserPortalID, true);
                }

                //Update DisplayName to conform to Format
                UpdateDisplayName();

                if (PortalSettings.Registration.RequireUniqueDisplayName)
                {
                    var usersWithSameDisplayName = (List<UserInfo>)MembershipProvider.Instance().GetUsersBasicSearch(PortalId, 0, 2, "DisplayName", true, "DisplayName", User.DisplayName);
                    if (usersWithSameDisplayName.Any(user => user.UserID != User.UserID))
                    {
                        AddModuleMessage("DisplayNameNotUnique", ModuleMessage.ModuleMessageType.RedError, true);
                        return;
                    }
                }

                var properties = (ProfilePropertyDefinitionCollection)ProfileProperties.DataSource;

                //Update User's profile
                User = ProfileController.UpdateUserProfile(User, properties);

                OnProfileUpdated(EventArgs.Empty);
                OnProfileUpdateCompleted(EventArgs.Empty);
            }
        }

        private void UpdateDisplayName()
        {
            if (!string.IsNullOrEmpty(PortalSettings.Registration.DisplayNameFormat))
            {
                User.UpdateDisplayName(PortalSettings.Registration.DisplayNameFormat);
            }
        }

        #endregion
    }
}
