﻿// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.
// See the LICENSE file in the project root for more information

#region Usings

using DotNetNuke.Collections.Internal;

#endregion

namespace DotNetNuke.ComponentModel
{
    internal class ComponentBuilderCollection : SharedDictionary<string, IComponentBuilder>
    {
        internal IComponentBuilder DefaultBuilder { get; set; }

        internal void AddBuilder(IComponentBuilder builder, bool setDefault)
        {
            if (!ContainsKey(builder.Name))
            {
                this[builder.Name] = builder;

                if (setDefault && DefaultBuilder == null)
                {
                    DefaultBuilder = builder;
                }
            }
        }
    }
}
