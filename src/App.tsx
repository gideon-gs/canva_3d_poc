import React, { useState, useRef, Suspense, JSX } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { useLoader } from "@react-three/fiber";

// Type definitions
type ObjectType = "box" | "sphere" | "cylinder" | "mug" | "shirt";

interface SceneProps {
  textureUrl: string | null;
  selectedObject: ObjectType;
  darkMode: boolean;
}

interface ObjectProps {
  texture: THREE.Texture | null;
  darkMode: boolean;
}

// The main application component
function App(): JSX.Element {
  const [textureUrl, setTextureUrl] = useState<string | null>(null);
  const [selectedObject, setSelectedObject] = useState<ObjectType>("box");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [darkMode, setDarkMode] = useState<boolean>(
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );

  // Handle file upload
  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const file = event.target.files?.[0];
    if (file && file.type.match("image.*")) {
      const url = URL.createObjectURL(file);
      setTextureUrl(url);
    }
  };

  // Handle object selection
  const handleObjectChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ): void => {
    setSelectedObject(event.target.value as ObjectType);
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`min-h-screen ${darkMode ? "dark" : ""}`}>
      <div className="flex flex-col w-full min-h-screen transition-colors duration-200 lg:flex-row dark:bg-gray-900 bg-gray-50">
        <div className="p-6 bg-white shadow-md lg:w-1/3 dark:bg-gray-800">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              3D Texture Mapping POC
            </h1>
            <button
              onClick={toggleDarkMode}
              className="p-2 text-gray-700 bg-gray-200 rounded-full dark:bg-gray-700 dark:text-gray-200"
            >
              {darkMode ? "🌞" : "🌙"}
            </button>
          </div>

          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Select 3D Object:
            </label>
            <select
              onChange={handleObjectChange}
              value={selectedObject}
              className="w-full p-2 text-gray-800 bg-white border border-gray-300 rounded dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="box">Box</option>
              <option value="cylinder">Cylinder</option>
              <option value="mug">Mug</option>
              <option value="shirt">Shirt</option>
            </select>
          </div>

          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Upload Texture:
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              ref={fileInputRef}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full px-4 py-2 font-medium text-white transition duration-150 bg-blue-600 rounded hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
            >
              Choose Image
            </button>
          </div>

          {textureUrl && (
            <div className="p-4 mt-6 border border-gray-300 rounded dark:border-gray-600">
              <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Texture Preview:
              </p>
              <img
                src={textureUrl}
                alt="Uploaded texture"
                className="h-auto max-w-full rounded shadow-sm"
              />
            </div>
          )}
        </div>

        <div className="lg:w-2/3 h-96 lg:h-screen">
          <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
            <color
              attach="background"
              args={[darkMode ? "#1a202c" : "#f7fafc"]}
            />
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
            <Suspense fallback={null}>
              <Scene
                key={textureUrl}
                textureUrl={textureUrl}
                selectedObject={selectedObject}
                darkMode={darkMode}
              />
            </Suspense>
            <OrbitControls />
          </Canvas>
        </div>
      </div>
    </div>
  );
}

// The 3D scene component
function Scene({
  textureUrl,
  selectedObject,
  darkMode,
}: SceneProps): JSX.Element {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const texture = textureUrl ? useTexture(textureUrl) : null;

  return (
    <>
      {selectedObject === "box" && (
        <Box texture={texture} darkMode={darkMode} />
      )}

      {selectedObject === "cylinder" && (
        <Cylinder texture={texture} darkMode={darkMode} />
      )}
      {selectedObject === "mug" && (
        <Mug texture={texture} darkMode={darkMode} />
      )}

      {selectedObject === "shirt" && (
        <Shirt texture={texture} darkMode={darkMode} />
      )}
    </>
  );
}
function Box({ texture, darkMode }: ObjectProps): JSX.Element {
  return (
    <mesh>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial
        attach="material-0"
        color={darkMode ? "white" : "#e2e8f0"}
      />{" "}
      {/* Back */}
      <meshStandardMaterial
        attach="material-1"
        color={darkMode ? "white" : "#e2e8f0"}
      />{" "}
      {/* Left */}
      <meshStandardMaterial
        attach="material-2"
        color={darkMode ? "white" : "#e2e8f0"}
      />{" "}
      {/* Right */}
      <meshStandardMaterial
        attach="material-3"
        color={darkMode ? "white" : "#e2e8f0"}
      />{" "}
      {/* Bottom */}
      <meshStandardMaterial attach="material-4" map={texture} />{" "}
      {/* Front Face (with Image) */}
      <meshStandardMaterial
        attach="material-5"
        color={darkMode ? "white" : "#e2e8f0"}
      />{" "}
      {/* Top */}
    </mesh>
  );
}

function Cylinder({ texture, darkMode }: ObjectProps): JSX.Element {
  return (
    <mesh>
      <cylinderGeometry args={[1, 1, 2, 32]} />
      <meshStandardMaterial attach="material-0" map={texture} />{" "}
      {/* Side Wall with Image */}
      <meshStandardMaterial
        attach="material-1"
        color={darkMode ? "white" : "#e2e8f0"}
      />{" "}
      {/* Top */}
      <meshStandardMaterial
        attach="material-2"
        color={darkMode ? "white" : "#e2e8f0"}
      />{" "}
      {/* Bottom */}
    </mesh>
  );
}

export function Mug({ texture, darkMode }: ObjectProps) {
  const { nodes } = useGLTF("plain_mug.glb");

  return (
    <group dispose={null} scale={[10, 10, 10]}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Object_2.geometry}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        {/* Apply Texture to Mug Surface */}
        <meshStandardMaterial
          map={texture}
          color={darkMode ? "white" : "#e2e8f0"}
          attach="material"
        />
      </mesh>
    </group>
  );
}

export function Shirt({ texture, darkMode }: ObjectProps) {
  const { nodes } = useGLTF("long_sleeve_t_shirt.glb");

  return (
    <group scale={0.015}>
      {/* Apply texture only to the front surface */}
      <mesh
        castShadow
        receiveShadow
        geometry={
          nodes["Long_Sleeve_T-Shirt_Bahan_Dasar_FRONT_2657_0"].geometry
        }
      >
        <meshStandardMaterial map={texture} />
      </mesh>

      {/* Apply solid color to other parts */}
      <mesh
        castShadow
        receiveShadow
        geometry={
          nodes["Long_Sleeve_T-Shirt_Bahan_Dasar_FRONT_2657_0_1"].geometry
        }
      >
        <meshStandardMaterial color={darkMode ? "#222222" : "#ffffff"} />
      </mesh>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes["Long_Sleeve_T-Shirt_Material2868_0"].geometry}
      >
        <meshStandardMaterial color={darkMode ? "#222222" : "#ffffff"} />
      </mesh>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes["Long_Sleeve_T-Shirt_Material2868_0_1"].geometry}
      >
        <meshStandardMaterial color={darkMode ? "#222222" : "#ffffff"} />
      </mesh>
    </group>
  );
}
useGLTF.preload("long_sleeve_t_shirt.glb");
useGLTF.preload("plain_mug.glb");

export default App;
