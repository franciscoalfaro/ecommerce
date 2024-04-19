import React, { useState } from 'react'
import useAuth from '../../hooks/useAuth'
import { Global } from '../../helpers/Global'
import avatar from '../../../src/assets/img/default.png'
import { SerializeForm } from '../../helpers/SerializeForm'
import { MyAddress } from './MyAddress'

export const Profile = () => {
  const { auth, setAuth } = useAuth()
  const [saved, setSaved] = useState("not_saved")

  const updateUser = async (e) => {
    e.preventDefault()

    const token = localStorage.getItem('token')


    //recoger datos del formulario
    let newDataUser = SerializeForm(e.target)
    //eliminar datos innecesarios
    delete newDataUser.file0

    //actualizar usuario en la BD
    const request = await fetch(Global.url + "user/update", {
      method: "PUT",
      body: JSON.stringify(newDataUser),
      headers: {
        "Content-Type": "application/json",
        "Authorization": token
      }
    })
    const data = await request.json()

    if (data.status == "success") {
      delete data.user.password
      setAuth({ ...auth, ...data.user })
      setSaved("saved")
      Swal.fire({ position: "bottom-end", title: "usuario actualizado correctamente",showConfirmButton: false,timer: 1000});
    } if (data.status == "warning") {
      setSaved("warning")
    } if (data.status == "error") {
      setSaved("error")
    }


    // subida de imagen al servidor
    const fileInput = document.querySelector("#file0");

    if (data.status == "success" && fileInput.files[0]) {
      // Recoger imagen a subir
      const formData = new FormData();
      formData.append('file0', fileInput.files[0]);

      // Verificar la extensión del archivo
      const fileName = fileInput.files[0].name;
      const fileExtension = fileName.split('.').pop().toLowerCase();

      if (fileExtension === 'gif') {
        // Si la extensión es .gif, subir el archivo sin comprimir
        const uploadRequest = await fetch(Global.url + "user/upload", {
          method: "POST",
          body: formData,
          headers: {
            "Authorization": token
          }
        });

        const uploadData = await uploadRequest.json();


        if (uploadData.status == "success" && uploadData.user) {
          delete uploadData.password;
          setAuth({ ...auth, ...uploadData.user });
          setTimeout(() => { window.location.reload() }, 0);
          setSaved("saved");
        } else {
          setSaved("error");
        }
      } else {
        // Si no es .gif, comprimir el archivo antes de subirlo
        const compressedFile = await compressImage(fileInput.files[0]);

        // Crear un nuevo FormData con el archivo comprimido
        const compressedFormData = new FormData();
        compressedFormData.append('file0', compressedFile);

        // Subir el archivo comprimido
        const uploadRequest = await fetch(Global.url + "user/upload", {
          method: "POST",
          body: compressedFormData,
          headers: {
            "Authorization": token
          }
        });

        const uploadData = await uploadRequest.json();


        if (uploadData.status == "success" && uploadData.user) {
          delete uploadData.password;
          setAuth({ ...auth, ...uploadData.user });
          setTimeout(() => { window.location.reload() }, 0);
          setSaved("saved");
        } else {
          setSaved("error");
        }
      }
    }


    // Función para comprimir la imagen
    async function compressImage(file, maxWidth, maxHeight, quality) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
          const img = new Image();
          img.src = event.target.result;
          img.onload = () => {
            // Crear un lienzo (canvas) para dibujar la imagen comprimida
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;
            if (width > maxWidth) {
              // Redimensionar la imagen si supera el ancho máximo
              height *= maxWidth / width;
              width = maxWidth;
            }
            if (height > maxHeight) {
              // Redimensionar la imagen si supera la altura máxima
              width *= maxHeight / height;
              height = maxHeight;
            }
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            // Dibujar la imagen en el lienzo con el tamaño redimensionado
            ctx.drawImage(img, 0, 0, width, height);
            // Convertir el lienzo a un archivo comprimido (blob)
            canvas.toBlob((blob) => {
              // Crear un nuevo archivo con el blob comprimido
              const compressedFile = new File([blob], file.name, { type: file.type });
              resolve(compressedFile);
            }, file.type, quality);
          };
        };
        reader.onerror = (error) => reject(error);
      });
    }


  }


  return (
    <section className="min-vh-100 mb-8">
      <div className="page-header align-items-start min-vh-10 pt-7 pb-5 m-6 border-radius-lg">
        <span className="mask bg-gradient-dark opacity-6"></span>
        <div className="container">
        </div>
      </div>
      <div className="container">
        <div className="row mt-lg-n10 mt-md-n11 mt-n10">
          <div className="col-xl-6">
            <div className="card">
              <div className="card-header text-center pt-4">
                <h5>Mis Datos</h5>
              </div>
              <div className="card-body">
                <form role="form text-left" onSubmit={updateUser}>
                  <div className="mb-3 d-flex justify-content-center">
                    <div className="d-flex align-items-center">
                      {auth.image == 'default.png' && <img src={avatar} className="img-fluid img-thumbnail rounded-circle profile-image" alt="Foto de perfil"></img>}
                      {auth.image != 'default.png' && <img src={Global.url + "user/avatar/" + auth.image} className="img-fluid img-thumbnail rounded-circle profile-image" alt="Foto de perfil"></img>}
                      <div className="ml-3">
                      </div>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label htmlFor='name'>Nombre</label>
                    <input type="text" className="form-control" name="name" defaultValue={auth.name} aria-label="Name" aria-describedby="name-addon" ></input>
                  </div>
                  <div className="mb-3">
                    <label htmlFor='surname'>Apellido</label>
                    <input type="text" className="form-control" name="surname" defaultValue={auth.surname} aria-label="Apellido" aria-describedby="name-addon" ></input>
                  </div>
                  <div className="mb-3">
                    <label htmlFor='nick'>Nick</label>
                    <input type="text" className="form-control" name="nick" defaultValue={auth.nick} aria-label="Nick" aria-describedby="name-addon" ></input>
                  </div>
                  <div className="mb-3">
                    <label htmlFor='email'>Email</label>
                    <input type="email" className="form-control" name="email" defaultValue={auth.email} aria-label="Email" aria-describedby="email-addon" ></input>
                  </div>
                  <div className="mb-3">
                    <label htmlFor='password'>Password</label>
                    <input type="password" className="form-control" name="password" placeholder="Password" aria-label="Password" aria-describedby="password-addon" ></input>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="file0">Actualizar Avatar:</label>
                    <input type="file" name='file0' id="file0" className="form-control"></input>
                  </div>
                  <div className="text-center">
                    <button type="submit" className="btn btn-primary">Actualizar</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          {auth.role === 'admin' ? (
            ''
          ) : (
            <div className="col-xl-6">
              <MyAddress></MyAddress>
            </div>
          )}
        </div>
      </div>
    </section>

  )
}
