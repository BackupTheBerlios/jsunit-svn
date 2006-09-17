/*
 * Copyright (C) 2006 J�rg Schaible
 * Created on 16.09.2006 by J�rg Schaible
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package de.berlios.jsunit;

/**
 * An exception used for JavaScript related problems.
 * 
 * @author J&ouml;rg Schaible
 * @since upcoming
 */
public class JsUnitException extends Exception {

    private static final long serialVersionUID = 20060916L;

    /**
     * Constructs a JsUnitException.
     * 
     * @param message the description
     * @param cause the causing exception
     * @since upcoming
     */
    public JsUnitException(final String message, final Throwable cause) {
        super(message, cause);
    }

    /**
     * Constructs a JsUnitException.
     * 
     * @param message the description
     * @since upcoming
     */
    public JsUnitException(final String message) {
        super(message);
    }
}
