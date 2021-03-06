﻿// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.
// See the LICENSE file in the project root for more information

using System;
using System.Runtime.Serialization;

using DotNetNuke.Services.Exceptions;

namespace DotNetNuke.Services.FileSystem
{
    [Serializable]
    public class InvalidFileContentException : Exception
    {
        public InvalidFileContentException()
        {
        }

        public InvalidFileContentException(string message)
            : base(message)
        {
        }

        public InvalidFileContentException(string message, Exception inner)
            : base(message, inner)
        {
        }

        public InvalidFileContentException(SerializationInfo info, StreamingContext context)
            : base(info, context)
        {
        }
    }
}
