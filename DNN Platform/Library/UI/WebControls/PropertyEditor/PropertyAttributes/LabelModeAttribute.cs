﻿// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.
// See the LICENSE file in the project root for more information

#region Usings

using System;

#endregion

namespace DotNetNuke.UI.WebControls
{
    [AttributeUsage(AttributeTargets.Property)]
    public sealed class LabelModeAttribute : Attribute
    {
        private readonly LabelMode _Mode;

        /// <summary>
        /// Initializes a new instance of the LabelModeAttribute class.
        /// </summary>
        /// <param name="mode">The label mode to apply to the associated property</param>
        public LabelModeAttribute(LabelMode mode)
        {
            _Mode = mode;
        }

        public LabelMode Mode
        {
            get
            {
                return _Mode;
            }
        }
    }
}
