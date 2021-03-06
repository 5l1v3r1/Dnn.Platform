﻿// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.
// See the LICENSE file in the project root for more information

#region Usings

using System;
using System.IO;
using System.Net;
using System.Text;
using System.Web;

#endregion

namespace DotNetNuke.Framework
{
    public abstract class BaseHttpHandler : IHttpHandler
    {
        private HttpContext _context;

        /// <summary>
        ///   Returns the <see cref = "HttpContext" /> object for the incoming HTTP request.
        /// </summary>
        public HttpContext Context
        {
            get
            {
                return _context;
            }
        }

        /// <summary>
        ///   Returns the <see cref = "HttpRequest" /> object for the incoming HTTP request.
        /// </summary>
        public HttpRequest Request
        {
            get
            {
                return Context.Request;
            }
        }

        /// <summary>
        ///   Gets the <see cref = "HttpResponse" /> object associated with the Page object. This object 
        ///   allows you to send HTTP response data to a client and contains information about that response.
        /// </summary>
        public HttpResponse Response
        {
            get
            {
                return Context.Response;
            }
        }

        /// <summary>
        ///   Gets the string representation of the body of the incoming request.
        /// </summary>
        public string Content
        {
            get
            {
                Request.InputStream.Position = 0;
                using (var Reader = new StreamReader(Request.InputStream))
                {
                    return Reader.ReadToEnd();
                }
            }
        }

        /// <summary>
        ///   Gets a value indicating whether this handler
        ///   requires users to be authenticated.
        /// </summary>
        /// <value>
        ///   <c>true</c> if authentication is required
        ///   otherwise, <c>false</c>.
        /// </value>
        public virtual bool RequiresAuthentication
        {
            get
            {
                return true;
            }
        }

        /// <summary>
        ///   Gets a value indicating whether the requester
        ///   has the necessary permissions.
        /// </summary>
        /// <remarks>
        ///   By default all authenticated users have permssions.  
        ///   This property is only enforced if <see cref = "RequiresAuthentication" /> is <c>true</c>
        /// </remarks>
        /// <value>
        ///   <c>true</c> if the user has the appropriate permissions
        ///   otherwise, <c>false</c>.
        /// </value>
        public virtual bool HasPermission
        {
            get
            {
                return Context.User.Identity.IsAuthenticated;
            }
        }

        /// <summary>
        ///   Gets the content MIME type for the response object.
        /// </summary>
        /// <value></value>
        public virtual string ContentMimeType
        {
            get
            {
                return "text/plain";
            }
        }

        /// <summary>
        ///   Gets the content encoding for the response object.
        /// </summary>
        /// <value></value>
        public virtual Encoding ContentEncoding
        {
            get
            {
                return Encoding.UTF8;
            }
        }

        #region IHttpHandler Members

        /// <summary>
        ///   Processs the incoming HTTP request.
        /// </summary>
        /// <param name = "context">Context.</param>
        public void ProcessRequest(HttpContext context)
        {
            _context = context;

            SetResponseCachePolicy(Response.Cache);

            if (!ValidateParameters())
            {
                RespondInternalError();
                return;
            }

            if (RequiresAuthentication && !HasPermission)
            {
                RespondForbidden();
                return;
            }

            Response.ContentType = ContentMimeType;
            Response.ContentEncoding = ContentEncoding;

            HandleRequest();
        }

        public virtual bool IsReusable
        {
            get
            {
                return true;
            }
        }

        #endregion

        /// <summary>
        ///   Handles the request.  This is where you put your
        ///   business logic.
        /// </summary>
        /// <remarks>
        ///   <p>This method should result in a call to one 
        ///     (or more) of the following methods:</p>
        ///   <p><code>context.Response.BinaryWrite();</code></p>
        ///   <p><code>context.Response.Write();</code></p>
        ///   <p><code>context.Response.WriteFile();</code></p>
        ///   <p>
        ///     <code>
        ///       someStream.Save(context.Response.OutputStream);
        ///     </code>
        ///   </p>
        ///   <p>etc...</p>
        ///   <p>
        ///     If you want a download box to show up with a 
        ///     pre-populated filename, add this call here 
        ///     (supplying a real filename).
        ///   </p>
        ///   <p>
        ///   <code>Response.AddHeader("Content-Disposition"
        ///     , "attachment; filename=\"" + Filename + "\"");</code>
        ///   </p>
        /// </remarks>
        public abstract void HandleRequest();

        /// <summary>
        ///   Validates the parameters.  Inheriting classes must
        ///   implement this and return true if the parameters are
        ///   valid, otherwise false.
        /// </summary>
        /// <returns><c>true</c> if the parameters are valid,
        ///   otherwise <c>false</c></returns>
        public abstract bool ValidateParameters();

        /// <summary>
        ///   Sets the cache policy.  Unless a handler overrides
        ///   this method, handlers will not allow a respons to be
        ///   cached.
        /// </summary>
        /// <param name = "cache">Cache.</param>
        public virtual void SetResponseCachePolicy(HttpCachePolicy cache)
        {
            cache.SetCacheability(HttpCacheability.NoCache);
            cache.SetNoStore();
            cache.SetExpires(DateTime.MinValue);
        }

        /// <summary>
        ///   Helper method used to Respond to the request
        ///   that the file was not found.
        /// </summary>
        protected void RespondFileNotFound()
        {
            Response.StatusCode = Convert.ToInt32(HttpStatusCode.NotFound);
            Response.End();
        }

        /// <summary>
        ///   Helper method used to Respond to the request
        ///   that an error occurred in processing the request.
        /// </summary>
        protected void RespondInternalError()
        {
            // It's really too bad that StatusCode property
            // is not of type HttpStatusCode.
            Response.StatusCode = Convert.ToInt32(HttpStatusCode.InternalServerError);
            Response.End();
        }

        /// <summary>
        ///   Helper method used to Respond to the request
        ///   that the request in attempting to access a resource
        ///   that the user does not have access to.
        /// </summary>
        protected void RespondForbidden()
        {
            Response.StatusCode = Convert.ToInt32(HttpStatusCode.Forbidden);
            Response.End();
        }
    }
}
